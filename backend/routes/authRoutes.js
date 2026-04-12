// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/authRoutes.js
// ============================================================

const express    = require('express');
const { body }   = require('express-validator');
const router     = express.Router();
const controller = require('../controllers/authController');
const { verifyToken }       = require('../middleware/authMiddleware');
const { authLimiter }       = require('../middleware/rateLimiter');
const { validateRequest }   = require('../middleware/validationMiddleware');

// ── Validation rules ──────────────────────────────────────────

const registerRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),
  body('role')
    .optional()
    .isIn(['student', 'mentor']).withMessage('Role must be student or mentor'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),
];

// ── Routes ────────────────────────────────────────────────────

// Public
router.post('/register', authLimiter, registerRules, validateRequest, controller.register);
router.post('/login',    authLimiter, loginRules,    validateRequest, controller.login);
router.post('/refresh',  controller.refreshToken);

// Protected
router.post('/logout',          verifyToken, controller.logout);
router.get('/me',               verifyToken, controller.getMe);
router.put('/change-password',  verifyToken, changePasswordRules, validateRequest, controller.changePassword);

module.exports = router;
