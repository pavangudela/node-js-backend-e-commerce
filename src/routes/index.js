import express from 'express';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
import productRoutes from './product.routes.js';
import shopRoutes from './shop.routes.js';
import userRoutes from './user.routes.js';
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/products', productRoutes);
router.use('/shop', shopRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;
