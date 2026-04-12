// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/studentRoutes.js
// ============================================================

const express    = require('express');
const { body }   = require('express-validator');
const router     = express.Router();
const controller = require('../controllers/studentController');
const { verifyToken }     = require('../middleware/authMiddleware');
const { requireRole }     = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

// ── Validation rules ──────────────────────────────────────────

const profileRules = [
  body('percentile')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentile must be between 0 and 100'),
  body('exam_type')
    .isIn(['CET', 'JEE'])
    .withMessage('Exam type must be CET or JEE'),
  body('category')
    .isIn(['OPEN', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'PWD'])
    .withMessage('Invalid category'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female or Other'),
  body('college_type')
    .optional()
    .isIn(['Government', 'Aided', 'Unaided', 'Autonomous', 'Any'])
    .withMessage('Invalid college type'),
  body('budget_max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('branch_preferences')
    .optional()
    .isArray()
    .withMessage('Branch preferences must be an array'),
  body('location_preferences')
    .optional()
    .isArray()
    .withMessage('Location preferences must be an array'),
];

// ── Routes ────────────────────────────────────────────────────

router.post(  '/create',  verifyToken, profileRules, validateRequest, controller.createProfile);
router.get(   '/profile', verifyToken, controller.getProfile);
router.put(   '/profile', verifyToken, profileRules, validateRequest, controller.updateProfile);
router.delete('/profile', verifyToken, controller.deleteProfile);

// Admin only
router.get('/all', verifyToken, requireRole('admin'), controller.getAllStudents);

module.exports = router;
