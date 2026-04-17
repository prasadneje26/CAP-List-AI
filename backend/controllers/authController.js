// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/authController.js
// ============================================================

const bcrypt        = require('bcryptjs');
const User          = require('../models/User');
const { signToken } = require('../middleware/jwtMiddleware');
const { query }     = require('../config/db');
const { AppError }  = require('../middleware/errorMiddleware');
const logger        = require('../utils/logger');
const jwt           = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET || 'dev-replit-jwt-secret-change-before-production';

const signAccess   = (payload) => signToken(payload, '1d');
const signRefresh  = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required.', 400);
    }
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters.', 400);
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: role === 'admin' ? 'student' : role });

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken  = signAccess(tokenPayload);
    const refreshToken = signRefresh(tokenPayload);

    logger.info(`New user registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/login ──────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required.', 400);
    }

    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError('Invalid email or password.', 401);
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken  = signAccess(tokenPayload);
    const refreshToken = signRefresh(tokenPayload);

    logger.info(`User logged in: ${user.email}`);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/refresh ────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required.', 400);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('User not found.', 401);

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken  = signAccess(tokenPayload);
    const newRefresh   = signRefresh(tokenPayload);

    return res.json({
      success: true,
      data: { accessToken, refreshToken: newRefresh },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/logout ─────────────────────────────────────
exports.logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
};

// ── GET /api/auth/me ──────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found.', 404);

    const studentResult = await query(
      `SELECT percentile, exam_type, category, gender, home_university,
              branch_preferences, location_preferences, college_type, budget_max, updated_at
       FROM students WHERE user_id = $1`,
      [user.id]
    );
    const student = studentResult.rows[0] || null;

    return res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, is_verified: user.is_verified, created_at: user.created_at },
        student,
      },
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/change-password ───────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Both current and new password are required.', 400);
    }
    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters.', 400);
    }

    const userRow = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!userRow.rows[0]) throw new AppError('User not found.', 404);

    const match = await bcrypt.compare(currentPassword, userRow.rows[0].password_hash);
    if (!match) throw new AppError('Current password is incorrect.', 401);

    const newHash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, req.user.id]);

    logger.info(`Password changed for user: ${req.user.email}`);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) { next(err); }
};
