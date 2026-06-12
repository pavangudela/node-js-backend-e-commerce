import express from 'express';
const router = express.Router();
import controller from '../controllers/catalog.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import roles from '../constants/roles.js';
import schema from '../validations/catalog.validation.js';

const admin = [authenticate, authorize(roles.ADMIN)];

router.get('/brands', validate(schema.search, 'query'), controller.brand.list);
router.get('/brands/:id', controller.brand.get);
router.post('/brands', ...admin, validate(schema.brand), controller.brand.create);
router.put('/brands/:id', ...admin, validate(schema.brand), controller.brand.update);
router.delete('/brands/:id', ...admin, controller.brand.remove);

router.get('/categories', validate(schema.search, 'query'), controller.category.list);
router.get('/categories/:id', controller.category.get);
router.post('/categories', ...admin, validate(schema.category), controller.category.create);
router.put('/categories/:id', ...admin, validate(schema.category), controller.category.update);
router.delete('/categories/:id', ...admin, controller.category.remove);

router.get('/subcategories', validate(schema.search, 'query'), controller.subcategory.list);
router.get('/subcategories/:id', controller.subcategory.get);
router.post('/subcategories', ...admin, validate(schema.subcategory), controller.subcategory.create);
router.put('/subcategories/:id', ...admin, validate(schema.subcategory), controller.subcategory.update);
router.delete('/subcategories/:id', ...admin, controller.subcategory.remove);

export default router;
