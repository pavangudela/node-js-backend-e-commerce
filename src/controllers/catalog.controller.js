import asyncHandler from '../utils/asyncHandler.js';
import catalog from '../services/catalog.service.js';

const makeController = (service) => ({
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await service.list(req.query) })),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await service.get(req.params.id) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await service.create(req.body) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await service.update(req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => {
    
    res.status(204).json({ success: true, message: await service.remove(req.params.id) });
  })
});

export const brand = makeController(catalog.brand);
export const category = makeController(catalog.category);
export const subcategory = makeController(catalog.subcategory);

export default {
  brand,
  category,
  subcategory
};
