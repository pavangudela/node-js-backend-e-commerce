import AppError from '../utils/AppError.js';

export default (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return next(new AppError('Validation failed', 400, error.details.map((detail) => detail.message)));
  }

  req[property] = value;
  return next();
};
