import asyncHandler from '../utils/asyncHandler.js';
import productService from '../services/product.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.list(req.query) });
});

export const get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.getById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await productService.create(req.body) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.update(req.params.id, req.body) });
});

export const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
});

export default {
  list,
  get,
  create,
  update,
  remove
};
