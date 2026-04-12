// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/roleMiddleware.js
// ============================================================

const { AppError } = require('./errorMiddleware');

// Usage: requireRole('admin') or requireRole('admin', 'mentor')
const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new AppError('Authentication required', 401));

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403)
    );
  }
  next();
};

module.exports = { requireRole };
