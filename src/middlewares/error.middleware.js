import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {

  logger.error(error);
  logger.error(error.errors);
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error({
      message: error.message,
      stack: error.stack,
      path: req.originalUrl
    });
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    details: error.details || null,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
};

export default {
  notFound,
  errorHandler
};
