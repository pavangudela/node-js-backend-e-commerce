import express from 'express';
const router = express.Router();
import controller from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import schema from '../validations/auth.validation.js';

router.post('/register', validate(schema.register), controller.register);
router.post('/login', validate(schema.login), controller.login);
router.post('/refresh', validate(schema.refresh), controller.refresh);
router.post('/logout', validate(schema.refresh), controller.logout);
router.post('/forgot-password', validate(schema.forgotPassword), controller.forgotPassword);
router.post('/reset-password', validate(schema.resetPassword), controller.resetPassword);
router.post('/verify-email', validate(schema.verifyEmail), controller.verifyEmail);

export default router;
