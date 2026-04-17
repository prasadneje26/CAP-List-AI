// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/chatbotRoutes.js
// ============================================================

const express        = require('express');
const { ask }        = require('../controllers/chatbotController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ask', optionalAuth, ask);

module.exports = router;
