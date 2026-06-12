import Joi from 'joi';

export default {
  couponValidate: Joi.object({
  code: Joi.string().required(),
  subtotal: Joi.number().required()
}),
  address: Joi.object({
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    pinCode: Joi.string().required(),
    state: Joi.string().required(),
    area: Joi.string().required(),
    landMark: Joi.string().allow('', null),
    buildingName: Joi.string().allow('', null),
    isDefault: Joi.boolean()
  }),
  cartItem: Joi.object({
    productId: Joi.number().integer().positive().required(),
    variantId: Joi.number().integer().positive().required(),
    qty: Joi.number().integer().min(1).max(10).default(1)
  }),
  updateCartItem: Joi.object({
    variantId: Joi.number().integer().positive().required(),
    qty: Joi.number().integer().min(0).max(10).required()
  }),
  checkout: Joi.object({
    paymentType: Joi.string().valid('COD', 'RAZORPAY').required(),
    addressId: Joi.number().integer().positive().required(),
    couponCode: Joi.string().allow('', null)
  }),
  orderStatus: Joi.object({
    status: Joi.string().valid('PLACED', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED').required()
  }),
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().max(160).allow('', null),
    comment: Joi.string().max(3000).allow('', null)
  }),
  coupon: Joi.object({
    code: Joi.string().max(60).required(),
    description: Joi.string().allow('', null),
    discountType: Joi.string().valid('PERCENTAGE', 'FIXED').required(),
    discountValue: Joi.number().positive().required(),
    maxDiscountAmount: Joi.number().positive().allow(null),
    minOrderAmount: Joi.number().min(0).default(0),
    usageLimit: Joi.number().integer().min(1).allow(null),
    startsAt: Joi.date().allow(null),
    expiresAt: Joi.date().allow(null),
    isActive: Joi.boolean()
  }),
  verifyPayment: Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required()
  })
};
