// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/pdfController.js
// ============================================================

const { query }        = require('../config/db');
const { AppError }     = require('../middleware/errorMiddleware');
const { generatePDF }  = require('../services/pdfGenerator');
const logger           = require('../utils/logger');

// ── GET /api/pdf/download ─────────────────────────────────────
const downloadReport = async (req, res, next) => {
  try {
    // Load student profile
    const studentResult = await query(
      `SELECT s.*, u.name, u.email
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1`,
      [req.user.id]
    );
    if (studentResult.rows.length === 0) {
      throw new AppError('Student profile not found. Please complete your profile first.', 404);
    }
    const student = studentResult.rows[0];

    // Load latest predictions
    const predictions = await query(
      `SELECT p.*, c.name AS college_name, c.code AS college_code,
              c.district, c.college_type, c.rating, c.annual_fees
       FROM predictions p
       JOIN colleges c ON c.id = p.college_id
       WHERE p.student_id = $1
       ORDER BY p.cap_order ASC`,
      [student.id]
    );

    if (predictions.rows.length === 0) {
      throw new AppError('No predictions found. Run a prediction first.', 404);
    }

    // Build report data object
    const reportData = {
      generatedAt: new Date().toISOString(),
      student: {
        name:                 student.name,
        email:                student.email,
        percentile:           student.percentile,
        exam_type:            student.exam_type,
        category:             student.category,
        gender:               student.gender,
        home_university:      student.home_university,
        branch_preferences:   student.branch_preferences,
        location_preferences: student.location_preferences,
        college_type:         student.college_type,
        budget_max:           student.budget_max,
      },
      predictions: predictions.rows,
      summary: {
        total:  predictions.rows.length,
        dream:  predictions.rows.filter((p) => p.classification === 'Dream').length,
        target: predictions.rows.filter((p) => p.classification === 'Target').length,
        safe:   predictions.rows.filter((p) => p.classification === 'Safe').length,
      },
    };

    logger.info(`Generating PDF report for user: ${req.user.id}`);

    // Generate PDF buffer
    const pdfBuffer = await generatePDF(reportData);

    const filename = `CAP_Report_${student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);

  } catch (err) {
    next(err);
  }
};

module.exports = { downloadReport };
