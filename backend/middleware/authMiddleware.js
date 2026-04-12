// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/authMiddleware.js
// ============================================================

const jwt          = require('jsonwebtoken');
const { query }    = require('../config/db');
const { AppError } = require('./errorMiddleware');

// ── Verify JWT token ──────────────────────────────────────────

const verifyToken = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB (catches deleted/banned accounts)
    const result = await query(
      'SELECT id, name, email, role, is_verified FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(err);
  }
};

// ── Optional auth (attaches user if token present) ────────────

const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length > 0) req.user = result.rows[0];
    next();
  } catch {
    next(); // ignore errors for optional auth
  }
};

module.exports = { verifyToken, optionalAuth };
