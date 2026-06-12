import Joi from 'joi';

const variant = Joi.object({
  id: Joi.number().integer().positive(),
  sku: Joi.string().allow('', null),
  color: Joi.string().required(),
  size: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  isActive: Joi.boolean()
});

const image = Joi.object({
  imageUrl: Joi.string().uri().required(),
  publicId: Joi.string().allow('', null),
  color: Joi.string().allow('', null),
  isPrimary: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0)
});

export default {
  create: Joi.object({
    brandId: Joi.number().integer().positive().allow(null),
    categoryId: Joi.number().integer().positive().required(),
    subcategoryId: Joi.number().integer().positive().allow(null),
    name: Joi.string().min(2).max(180).required(),
    description: Joi.string().allow('', null),
    price: Joi.number().positive().required(),
    compareAtPrice: Joi.number().positive().allow(null),
    material: Joi.string().allow('', null),
    fit: Joi.string().allow('', null),
    pattern: Joi.string().allow('', null),
    sizes: Joi.array().items(Joi.string()),
    colors: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    variants: Joi.array().items(variant).min(1).required(),
    images: Joi.array().items(image)
  }),
  update: Joi.object({
    brandId: Joi.number().integer().positive().allow(null),
    categoryId: Joi.number().integer().positive(),
    subcategoryId: Joi.number().integer().positive().allow(null),
    name: Joi.string().min(2).max(180),
    description: Joi.string().allow('', null),
    price: Joi.number().positive(),
    compareAtPrice: Joi.number().positive().allow(null),
    material: Joi.string().allow('', null),
    fit: Joi.string().allow('', null),
    pattern: Joi.string().allow('', null),
    sizes: Joi.array().items(Joi.string()),
    colors: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    variants: Joi.array().items(variant),
    images: Joi.array().items(image)
  }).min(1),
  search: Joi.object({
    q: Joi.string().allow('', null),
    categoryId: Joi.number().integer().positive(),
    subcategoryId: Joi.number().integer().positive(),
    brandId: Joi.number().integer().positive(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sort: Joi.string().valid('newest', 'price_asc', 'price_desc', 'rating_desc', 'name_asc').default('newest'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};
