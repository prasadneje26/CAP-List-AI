// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/recommendationRoutes.js
// ============================================================

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/', ctrl.getRecommendations);

module.exports = router;
