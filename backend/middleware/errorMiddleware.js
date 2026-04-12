// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/errorMiddleware.js
// ============================================================

const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorMiddleware, AppError };
