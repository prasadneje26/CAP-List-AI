// ============================================================
// File: backend/routes/feedbackRoutes.js
// ============================================================
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const ctrl     = require('../controllers/feedbackController');
const { verifyToken }     = require('../middleware/authMiddleware');
const { requireRole }     = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const feedbackRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('message').optional().isLength({ max: 1000 }).withMessage('Message too long'),
  body('category').optional()
    .isIn(['general','ui','prediction','mentorship','other'])
    .withMessage('Invalid category'),
];

router.use(verifyToken);
router.post('/submit', feedbackRules, validateRequest, ctrl.submitFeedback);
router.get('/my',      ctrl.getMyFeedback);
router.get('/all',     requireRole('admin'), ctrl.getAllFeedback);
router.patch('/:id/resolve', requireRole('admin'), ctrl.resolveFeedback);

module.exports = router;
