// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/validationMiddleware.js
// ============================================================

const { validationResult } = require('express-validator');
const { AppError }         = require('./errorMiddleware');

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(messages, 422));
  }
  next();
};

module.exports = { validateRequest };
