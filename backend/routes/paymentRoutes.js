// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/paymentRoutes.js
// ============================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/plans',              ctrl.getPlans);
router.post('/create-intent',     verifyToken, ctrl.createPaymentIntent);
router.post('/confirm',           verifyToken, ctrl.confirmPayment);

module.exports = router;
