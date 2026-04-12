// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/feedbackController.js
// ============================================================

const { v4: uuidv4 } = require('uuid');
const { query }      = require('../config/db');
const { AppError }   = require('../middleware/errorMiddleware');
const logger         = require('../utils/logger');

// ── POST /api/feedback/submit ─────────────────────────────────
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, message, category = 'general' } = req.body;

    const result = await query(
      `INSERT INTO feedback (id, user_id, rating, message, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [uuidv4(), req.user.id, rating, message, category]
    );

    logger.info(`Feedback submitted by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you!',
      data: { feedback: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/feedback/my ──────────────────────────────────────
const getMyFeedback = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: { feedback: result.rows } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/feedback/all  (admin only) ───────────────────────
const getAllFeedback = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT f.*, u.name, u.email
       FROM feedback f
       JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const count = await query('SELECT COUNT(*) FROM feedback');
    const avgRating = await query('SELECT ROUND(AVG(rating),2) AS avg FROM feedback');

    res.status(200).json({
      success: true,
      data: {
        feedback: result.rows,
        avg_rating: avgRating.rows[0].avg,
        pagination: {
          total: parseInt(count.rows[0].count),
          page,
          limit,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/feedback/:id/resolve  (admin only) ────────────
const resolveFeedback = async (req, res, next) => {
  try {
    const result = await query(
      `UPDATE feedback SET is_resolved = TRUE WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) throw new AppError('Feedback not found', 404);
    res.status(200).json({ success: true, data: { feedback: result.rows[0] } });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFeedback, getMyFeedback, getAllFeedback, resolveFeedback };
