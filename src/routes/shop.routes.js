import express from 'express';
const router = express.Router();
import controller from '../controllers/shop.controller.js';
import payment from '../controllers/payment.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import roles from '../constants/roles.js';
import schema from '../validations/shop.validation.js';
import shop from '../controllers/shop.controller.js';
 

router.use(authenticate);

router.get('/addresses', controller.addresses.list);
router.get('/addresses/default', controller.addresses.default);
router.get('/addresses/:id', controller.addresses.get);
router.post('/addresses', validate(schema.address), controller.addresses.create);
router.put('/addresses/:id', validate(schema.address), controller.addresses.update);
router.delete('/addresses/:id', controller.addresses.remove);

router.get('/cart', authorize(roles.CUSTOMER), controller.cart.get);
router.post('/cart/items', authorize(roles.CUSTOMER), validate(schema.cartItem), controller.cart.add);
router.patch('/cart/items', authorize(roles.CUSTOMER), validate(schema.updateCartItem), controller.cart.update);
router.delete('/cart/items/:variantId', authorize(roles.CUSTOMER), controller.cart.removeItem);
router.delete('/cart', authorize(roles.CUSTOMER), controller.cart.clear);
router.post('/coupons/validate', validate(schema.couponValidate), controller.coupons.validate);
router.get('/coupons', shop.coupons.list);

router.post('/orders', authorize(roles.CUSTOMER), validate(schema.checkout), controller.orders.checkout);
router.get('/orders/my', authorize(roles.CUSTOMER), controller.orders.mine);
router.get('/orders/:id', controller.orders.get);
router.post('/orders/:orderId/items/:itemId/cancel', authorize(roles.CUSTOMER), controller.orders.cancelItem);
router.get('/orders', authorize(roles.ADMIN), controller.orders.all);
router.patch('/orders/:id/status', authorize(roles.ADMIN), validate(schema.orderStatus), controller.orders.status);
router.patch('/orders/:orderId/items/:itemId/status', authorize(roles.ADMIN), validate(schema.orderStatus), controller.orders.itemStatus);

router.get('/wishlist', authorize(roles.CUSTOMER), controller.wishlist.list);
router.post('/wishlist/:productId', authorize(roles.CUSTOMER), controller.wishlist.add);
router.delete('/wishlist/:productId', authorize(roles.CUSTOMER), controller.wishlist.remove);

router.post('/payments/razorpay/:orderId', authorize(roles.CUSTOMER), payment.createRazorpayOrder);
router.post('/payments/verify', authorize(roles.CUSTOMER), validate(schema.verifyPayment), payment.verify);

export default router;
