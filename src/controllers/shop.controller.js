import asyncHandler from '../utils/asyncHandler.js';
import addressService from '../services/address.service.js';
import cartService from '../services/cart.service.js';
import orderService from '../services/order.service.js';
import wishlistService from '../services/wishlist.service.js';
import reviewService from '../services/review.service.js';
import couponService from '../services/coupon.service.js';

export const addresses = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await addressService.list(req.user.id) })),
  default: asyncHandler(async (req, res) => res.json({ success: true, data: await addressService.getDefault(req.user.id) })),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await addressService.getOwned(req.user.id, req.params.id) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await addressService.create(req.user.id, req.body) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await addressService.update(req.user.id, req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => res.json({ success: true, data: await addressService.remove(req.user.id, req.params.id) }))
};

export const cart = {
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await cartService.getCart(req.user.id) })),
  add: asyncHandler(async (req, res) => res.json({ success: true, data: await cartService.addItem(req.user.id, req.body) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await cartService.updateItem(req.user.id, req.body) })),
  removeItem: asyncHandler(async (req, res) => res.json({ success: true, data: await cartService.removeItem(req.user.id, req.params.variantId) })),
  clear: asyncHandler(async (req, res) => {
    await cartService.clear(req.user.id);
    res.status(204).send();
  })
};

export const orders = {
  checkout: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await orderService.checkout(req.user.id, req.body) })),
  mine: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.listMine(req.user.id) })),
  all: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.listAll() })),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.getOrder(req.params.id, req.user) })),
  status: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.updateStatus(req.params.id, req.body.status) })),
  itemStatus: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.updateItemStatus(req.params.orderId, req.params.itemId, req.body.status) })),
  cancelItem: asyncHandler(async (req, res) => res.json({ success: true, data: await orderService.cancelItem(req.user.id, req.params.orderId, req.params.itemId) }))
};

export const wishlist = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await wishlistService.list(req.user.id) })),
  add: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await wishlistService.add(req.user.id, req.params.productId) })),
  remove: asyncHandler(async (req, res) => res.json({ success: true, data: await wishlistService.remove(req.user.id, req.params.productId) }))
};

export const reviews = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await reviewService.list(req.params.productId) })),
  upsert: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await reviewService.upsert(req.user.id, req.params.productId, req.body) })),
  remove: asyncHandler(async (req, res) => {
    
    await reviewService.remove(req.user.id, req.params.productId);
    res.status(204).send();
  })
};

export const coupons = {
  validate: asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const data = await couponService.calculateDiscount(
    code,
    subtotal,
    null
  );

  res.json({
    success: true,
    data
  });
}),
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await couponService.list() })),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await couponService.get(req.params.id) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await couponService.create(req.body) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await couponService.update(req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => {
    await couponService.remove(req.params.id);
    res.status(204).send();
  })
};

export default {
  addresses,
  cart,
  orders,
  wishlist,
  reviews,
  coupons
};
