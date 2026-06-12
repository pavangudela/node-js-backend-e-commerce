import AppError from '../utils/AppError.js';

export default (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Access denied. Insufficient permissions', 403));
  }
  return next();
};
