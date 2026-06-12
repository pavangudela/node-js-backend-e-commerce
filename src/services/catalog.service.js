import { Op } from 'sequelize';
import { Brand, Category, Subcategory } from '../models/index.js';
import AppError from '../utils/AppError.js';
import slugify from '../utils/slug.js';

const searchWhere = (q) => q ? { name: { [Op.like]: `%${q}%` } } : {};

const crud = (Model) => ({
  async list(query = {}) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const { rows, count } = await Model.findAndCountAll({
      where: searchWhere(query.q),
      limit,
      offset: (page - 1) * limit,
      order: [['name', 'ASC']]
    });
    return { rows, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } };
  },
  async get(id) {
    const row = await Model.findByPk(id);
    if (!row) throw new AppError(`${Model.name} not found`, 404);
    return row;
  },
  async create(payload) {
    return Model.create({ ...payload, slug: slugify(payload.name) });
  },
  async update(id, payload) {
    const row = await this.get(id);
    await row.update({ ...payload, ...(payload.name ? { slug: slugify(payload.name) } : {}) });
    return row;
  },
  async remove(id) {
    const row = await this.get(id);
    await row.destroy();
    return { message: `${Model.name} deleted successfully` };
  }
});

const brand = crud(Brand);
const category = crud(Category);
const subcategoryBase = crud(Subcategory);

const subcategory = {
  ...subcategoryBase,
  async list(query = {}) {
    const result = await subcategoryBase.list(query);
    result.rows = await Subcategory.findAll({
      where: searchWhere(query.q),
      include: [{ model: Category, as: 'category' }],
      limit: result.pagination.limit,
      offset: (result.pagination.page - 1) * result.pagination.limit,
      order: [['name', 'ASC']]
    });
    return result;
  }
};

export default {
  brand,
  category,
  subcategory
};
