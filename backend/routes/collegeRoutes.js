// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/routes/collegeRoutes.js
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/collegeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/',              verifyToken, controller.getAllColleges);
router.get('/:id',           verifyToken, controller.getCollegeById);
router.get('/:id/cutoffs',   verifyToken, controller.getCollegeCutoffs);

module.exports = router;
