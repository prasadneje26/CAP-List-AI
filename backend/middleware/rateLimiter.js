// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/rateLimiter.js
// ============================================================

const rateLimit = require('express-rate-limit');

const disableRateLimit = process.env.DISABLE_RATE_LIMIT === 'true';
const isProduction = process.env.NODE_ENV === 'production';

const defaultWindowMs = 15 * 60 * 1000; // 15 minutes
const defaultMax = isProduction ? 100 : 1000;
const defaultAuthMax = isProduction ? 10 : 50;

const createLimiter = (options) =>
  disableRateLimit
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: defaultWindowMs,
        standardHeaders: true,
        legacyHeaders: false,
        ...options,
      });

const rateLimiter = createLimiter({
  max: parseInt(process.env.RATE_LIMIT_MAX || defaultMax, 10),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = createLimiter({
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || defaultAuthMax, 10),
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
});

module.exports = { rateLimiter, authLimiter };
