import { Op } from 'sequelize';
import sequelize from '../database/sequelize.js';
import { Product, ProductImage, ProductVariant, Brand, Category, Subcategory } from '../models/index.js';
import AppError from '../utils/AppError.js';
import slugify from '../utils/slug.js';
import logger from '../utils/logger.js';

const include = [
  { model: Brand, as: 'brand' },
  { model: Category, as: 'category' },
  { model: Subcategory, as: 'subcategory' },
  { model: ProductImage, as: 'images' },
  { model: ProductVariant, as: 'variants' }
];

const sortMap = {
  newest: [['createdAt', 'DESC']],
  price_asc: [['price', 'ASC']],
  price_desc: [['price', 'DESC']],
  rating_desc: [['averageRating', 'DESC']],
  name_asc: [['name', 'ASC']]
};

const list = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const where = { isActive: true };
  if (query.q) where[Op.or] = [{ name: { [Op.like]: `%${query.q}%` } }, { description: { [Op.like]: `%${query.q}%` } }];
  if (query.brandId) where.brandId = query.brandId;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.subcategoryId) where.subcategoryId = query.subcategoryId;
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price[Op.gte] = query.minPrice;
    if (query.maxPrice) where.price[Op.lte] = query.maxPrice;
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    include,
    distinct: true,
    limit,
    offset: (page - 1) * limit,
    order: sortMap[query.sort || 'newest']
  });
  return { rows, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } };
};

const getById = async (id, transaction) => {
  const product = await Product.findByPk(id, { include, transaction });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const create = (payload) => sequelize.transaction(async (transaction) => {
  logger.info('Creating product with payload:', payload);
  const product = await Product.create({ ...payload, slug: slugify(payload.name) }, { transaction });
  if (payload.images?.length) {
    await ProductImage.bulkCreate(payload.images.map((img) => ({ ...img, productId: product.id })), { transaction });
  }

 if (payload.variants?.length) {
  await ProductVariant.bulkCreate(payload.variants.map((variant) => ({ ...variant, productId: product.id })), { transaction });
}

  return getById(product.id, transaction);
});

const update = (id, payload) => sequelize.transaction(async (transaction) => {
  const product = await getById(id, transaction);
  logger.info(`Updating product ${id} with payload:`, payload);
  await product.update({ ...payload, ...(payload.name ? { slug: slugify(payload.name) } : {}) }, { transaction });
  console.log("PAYLOAD VARIANTS:", payload.variants);
  if (payload.images?.length) {
    await ProductImage.destroy({ where: { productId: id }, transaction });
    await ProductImage.bulkCreate(payload.images.map((img) => ({ ...img, productId: id })), { transaction });
  }
  if (payload.variants?.length) {
    for (const variant of payload.variants) {
      if (variant.id) {
        await ProductVariant.update(variant, { where: { id: variant.id, productId: id }, transaction });
      } else {
        await ProductVariant.create({ ...variant, productId: id }, { transaction });
      }
    }
  }
  return getById(id, transaction);
});

const remove = async (id) => {
  const product = await getById(id);
  await sequelize.transaction(async (transaction) => {
    await ProductImage.destroy({ where: { productId: id }, transaction });
    await ProductVariant.destroy({ where: { productId: id }, transaction });
    await product.destroy({ transaction });
  });
};

export default {
  list,
  getById,
  create,
  update,
  remove
};
