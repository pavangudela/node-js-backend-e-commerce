import crypto from 'crypto';
import Razorpay from 'razorpay';
import sequelize from '../database/sequelize.js';
import { Order, Payment } from '../models/index.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import orderStatus from '../constants/orderStatus.js';
import paymentStatus from '../constants/paymentStatus.js';

const client = () => {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw new AppError('Razorpay is not configured', 500);
  }
  return new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });
};

const createOrder = async (orderId, userId) => {
  const order = await Order.findOne({ where: { id: orderId, userId } });
  if (!order) throw new AppError('Order not found', 404);
  const amount = Math.round(Number(order.totalPrice) * 100);
  const razorOrder = await client().orders.create({
    amount,
    currency: 'INR',
    receipt: `order_rcpt_${order.id}`,
    payment_capture: 1
  });
  await Payment.create({
    orderId: order.id,
    amount: order.totalPrice,
    currency: 'INR',
    razorpayOrderId: razorOrder.id,
    status: paymentStatus.PENDING
  });
  await order.update({ razorpayOrderId: razorOrder.id });
  return { razorpayOrderId: razorOrder.id, amount, currency: 'INR', keyId: env.razorpay.keyId };
};

const verifyPayment = ({ orderId, paymentId, signature }) => sequelize.transaction(async (transaction) => {
  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  if (expected !== signature) throw new AppError('Payment signature verification failed', 400);

  const payment = await Payment.findOne({ where: { razorpayOrderId: orderId }, transaction });
  if (!payment) throw new AppError('Payment record not found', 404);
  await payment.update({ razorpayPaymentId: paymentId, razorpaySignature: signature, status: paymentStatus.SUCCESS }, { transaction });
  await Order.update({ status: orderStatus.PLACED }, { where: { id: payment.orderId }, transaction });
  return { success: true, message: 'Payment successful' };
});

const handleWebhook = async (rawBody, signature) => {
  const expected = crypto.createHmac('sha256', env.razorpay.webhookSecret).update(rawBody).digest('hex');
  if (expected !== signature) throw new AppError('Invalid webhook signature', 400);
  const event = JSON.parse(rawBody.toString('utf8'));
  const paymentEntity = event.payload?.payment?.entity;
  if (!paymentEntity) return { received: true };
 const payment=await Payment.findOne({ where: { razorpayOrderId: paymentEntity.order_id } });
 if(!payment) throw new AppError('Payment record not found', 404);
  const order = await Order.findByPk(payment.orderId, {
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      transaction
    });

    if (!order) {
      return { received: true };
    }
  if (event.event === 'payment.captured') {

    
      if (payment.status !== paymentStatus.SUCCESS) {

        await payment.update({
          status: paymentStatus.SUCCESS,
          razorpayPaymentId: paymentEntity.id,
          webhookEventId: event.event
        }, { transaction });

        await order.update({
          status: orderStatus.PLACED
        }, { transaction });

        // release reservation
        for (const item of order.items) {
          const variant = await ProductVariant.findByPk(
            item.variantId,
            { transaction }
          );

          if (!variant) continue;

          await variant.update({
            reservedStock: Math.max(
              0,
              variant.reservedStock - item.quantity
            )
          }, { transaction });
        }
      }
    }
 
    if (event.event === 'payment.failed') {
 
      if (payment.status !== paymentStatus.FAILED) {

        await payment.update({
          status: paymentStatus.FAILED,
          razorpayPaymentId: paymentEntity.id,
          webhookEventId: event.event
        }, { transaction });

        await order.update({
          status: orderStatus.CANCELLED
        }, { transaction });

       
        for (const item of order.items) {
          const variant = await ProductVariant.findByPk(
            item.variantId,
            { transaction }
          );

          if (!variant) continue;

          await variant.update({
            stock: variant.stock + item.quantity,
            reservedStock: Math.max(
              0,
              variant.reservedStock - item.quantity
            )
          }, { transaction });
        }
      }
    }

    return { received: true };
};


export default {
  createOrder,
  verifyPayment,
  handleWebhook
};
