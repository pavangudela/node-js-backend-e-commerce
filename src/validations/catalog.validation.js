import Joi from 'joi';

const active = { isActive: Joi.boolean() };
const named = {
  name: Joi.string().min(2).max(140).required(),
  description: Joi.string().allow('', null),
  ...active
};

export const brand = Joi.object({
  ...named,
  logoUrl: Joi.string().uri().allow('', null),
  logoPublicId: Joi.string().allow('', null)
});
export const category = Joi.object(named);
export const subcategory = Joi.object({
  ...named,
  categoryId: Joi.number().integer().positive().required()
});
export const search = Joi.object({
  q: Joi.string().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export default {
  brand,
  category,
  subcategory,
  search
};
