import Joi from 'joi';
import express from 'express';
const router = express.Router();
import admin from '../controllers/admin.controller.js';
import users from '../controllers/user.controller.js';
import shop from '../controllers/shop.controller.js';
import upload from '../controllers/upload.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import uploader from '../middlewares/upload.middleware.js';
import roles from '../constants/roles.js';
import shopSchema from '../validations/shop.validation.js';

router.use(authenticate, authorize(roles.ADMIN));

router.get('/dashboard', admin.dashboard);
router.get('/users', users.listUsers);
router.delete('/users/:id', users.deleteUser);

router.get('/coupons', shop.coupons.list);
router.get('/coupons/:id', shop.coupons.get);
router.post('/coupons', validate(shopSchema.coupon), shop.coupons.create);
router.put('/coupons/:id', validate(shopSchema.coupon), shop.coupons.update);
router.delete('/coupons/:id', shop.coupons.remove);

router.post('/uploads/product-images', uploader.single('image'), upload.productImage);
router.post('/uploads/brand-logos', uploader.single('image'), upload.brandLogo);

router.patch('/me/username', validate(Joi.object({ username: Joi.string().min(2).max(120).required() })), users.changeUsername);

export default router;
