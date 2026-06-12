import Joi from 'joi';
import express from 'express';
const router = express.Router();
import controller from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

router.use(authenticate);

router.get('/me', controller.profile);
router.patch('/me/username', validate(Joi.object({ username: Joi.string().min(2).max(120).required() })), controller.changeUsername);
router.post('/me/change-password', validate(Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(72).required()
})), controller.changePassword);

export default router;
