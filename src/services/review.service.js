import sequelize from '../database/sequelize.js';
import { Product, Review, User } from '../models/index.js';
import AppError from '../utils/AppError.js';

const recalcProductRating = async (productId, transaction) => {
  const result = await Review.findAll({
    where: { productId, isApproved: true },
    attributes: ['rating'],
    transaction
  });
  const totalReviews = result.length;
  const averageRating = totalReviews
    ? parseFloat((result.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
    : 0;
  await Product.update({ totalReviews, averageRating }, { where: { id: productId }, transaction });
};

const list = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product)  throw new AppError('Product not found', 404);

  const reviews = await Review.findAll({
    where: { productId, isApproved: true },
    include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
    order: [['createdAt', 'DESC']]
  });

   
  return reviews || [];
};

const upsert = (userId, productId, payload) => sequelize.transaction(async (transaction) => {
  const product = await Product.findByPk(productId, { transaction });
  if (!product) throw new AppError('Product not found', 404);
  if (!product.isActive) throw new AppError('Cannot review an inactive product', 400);

  const [review, created] = await Review.findOrCreate({
    where: { userId, productId },
    defaults: { userId, productId, ...payload },
    transaction
  });

  if (!created) await review.update(payload, { transaction });
  await recalcProductRating(productId, transaction);
  return { review, created }; // 👈 lets controller respond 201 vs 200
});

const remove = (userId, productId) => sequelize.transaction(async (transaction) => {
  const review = await Review.findOne({ where: { userId, productId }, transaction });
  if (!review) throw new AppError('Review not found', 404); // 👈 was silently doing nothing

  await review.destroy({ force: true, transaction });
  await recalcProductRating(productId, transaction);
});

export default { list, upsert, remove };
