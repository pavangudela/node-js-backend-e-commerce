import asyncHandler from '../utils/asyncHandler.js';
import uploadService from '../services/upload.service.js';

export const productImage = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await uploadService.uploadImage(req.file, 'ecommerce/products') });
});

export const brandLogo = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await uploadService.uploadImage(req.file, 'ecommerce/brands') });
});

export default {
  productImage,
  brandLogo
};
