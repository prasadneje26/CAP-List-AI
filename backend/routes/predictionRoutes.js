// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/predictionRoutes.js
// ============================================================

const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const ctrl     = require('../controllers/predictionController');
const { verifyToken }     = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const cutoffRules = [
  body('college_id').notEmpty().withMessage('College ID required'),
  body('branch').notEmpty().withMessage('Branch required'),
  body('category').isIn(['OPEN','OBC','SC','ST','EWS','TFWS','PWD']).withMessage('Invalid category'),
  body('exam_type').isIn(['CET','JEE']).withMessage('Exam type must be CET or JEE'),
];

const admissionRules = [
  body('percentile').isFloat({ min: 0, max: 100 }).withMessage('Valid percentile required'),
  body('cutoff_percentile').isFloat({ min: 0, max: 100 }).withMessage('Valid cutoff required'),
  body('category').isIn(['OPEN','OBC','SC','ST','EWS','TFWS','PWD']).withMessage('Invalid category'),
  body('exam_type').isIn(['CET','JEE']).withMessage('Exam type must be CET or JEE'),
];

// All prediction routes require auth
router.use(verifyToken);

router.post('/full',       ctrl.fullPrediction);
router.post('/cutoff',     cutoffRules,    validateRequest, ctrl.predictCutoff);
router.post('/admission',  admissionRules, validateRequest, ctrl.predictAdmission);
router.get('/history',     ctrl.getPredictionHistory);

module.exports = router;
