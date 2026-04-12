// ============================================================
// File: backend/routes/pdfRoutes.js
// ============================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/pdfController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/download', ctrl.downloadReport);

module.exports = router;
