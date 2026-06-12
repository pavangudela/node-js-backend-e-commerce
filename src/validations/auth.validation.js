import Joi from 'joi';

export default {
  register: Joi.object({
    username: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(72).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required()
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).max(72).required()
  }),
  verifyEmail: Joi.object({
    token: Joi.string().required()
  })
};
