// ============================================================
// File: backend/routes/mentorshipRoutes.js
// ============================================================
const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const ctrl     = require('../controllers/mentorshipController');
const { verifyToken }     = require('../middleware/authMiddleware');
const { requireRole }     = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const bookRules = [
  body('mentor_id').notEmpty().withMessage('Mentor ID required'),
  body('session_date').isISO8601().withMessage('Valid date required'),
  body('topic').notEmpty().isLength({ max: 200 }).withMessage('Topic required (max 200 chars)'),
  body('duration_minutes').optional().isInt({ min: 15, max: 120 }).withMessage('Duration 15–120 mins'),
];

router.use(verifyToken);
router.get('/mentors',          ctrl.getAvailableMentors);
router.post('/book',            bookRules, validateRequest, ctrl.bookSession);
router.get('/my',               ctrl.getMySessions);
router.get('/mentor-sessions',  requireRole('mentor'), ctrl.getMentorSessions);
router.patch('/:id/confirm',    requireRole('mentor'), ctrl.confirmSession);
router.patch('/:id/cancel',     ctrl.cancelSession);

module.exports = router;
