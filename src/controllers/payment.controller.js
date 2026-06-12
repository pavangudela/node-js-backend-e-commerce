import asyncHandler from '../utils/asyncHandler.js';
import paymentService from '../services/payment.service.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await paymentService.createOrder(req.params.orderId, req.user.id) });
});

export const verify = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await paymentService.verifyPayment(req.body) });
});

export const webhook = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await paymentService.handleWebhook(req.body, req.headers['x-razorpay-signature']) });
});

export default {
  createRazorpayOrder,
  verify,
  webhook
};
