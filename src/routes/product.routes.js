import express from 'express';
const router = express.Router();
import controller from '../controllers/product.controller.js';
import shop from '../controllers/shop.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import roles from '../constants/roles.js';
import schema from '../validations/product.validation.js';
import shopSchema from '../validations/shop.validation.js';

router.get('/', validate(schema.search, 'query'), controller.list);
router.get('/:id', controller.get);
router.get('/:productId/reviews', shop.reviews.list);

router.post('/:productId/reviews', authenticate, authorize(roles.CUSTOMER), validate(shopSchema.review), shop.reviews.upsert);
router.delete('/:productId/reviews/me', authenticate, authorize(roles.CUSTOMER), shop.reviews.remove);

router.post('/', authenticate, authorize(roles.ADMIN), validate(schema.create), controller.create);
router.put('/:id', authenticate, authorize(roles.ADMIN), validate(schema.update), controller.update);
router.delete('/:id', authenticate, authorize(roles.ADMIN), controller.remove);

export default router;
