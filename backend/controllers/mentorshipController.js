// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/mentorshipController.js
// ============================================================

const { v4: uuidv4 } = require('uuid');
const { query }      = require('../config/db');
const { AppError }   = require('../middleware/errorMiddleware');
const logger         = require('../utils/logger');

// ── POST /api/mentorship/book ─────────────────────────────────
const bookSession = async (req, res, next) => {
  try {
    const {
      mentor_id,
      session_date,
      duration_minutes = 30,
      topic,
    } = req.body;

    // Validate mentor exists and has mentor role
    const mentorCheck = await query(
      `SELECT id FROM users WHERE id = $1 AND role = 'mentor'`,
      [mentor_id]
    );
    if (mentorCheck.rows.length === 0) {
      throw new AppError('Mentor not found', 404);
    }

    // Check for slot conflict (same mentor, overlapping time)
    const conflict = await query(
      `SELECT id FROM mentorship
       WHERE mentor_id = $1
         AND status NOT IN ('cancelled')
         AND session_date BETWEEN $2::timestamp - INTERVAL '30 min'
                              AND $2::timestamp + INTERVAL '30 min'`,
      [mentor_id, session_date]
    );
    if (conflict.rows.length > 0) {
      throw new AppError('This time slot is already booked. Please choose another.', 409);
    }

    const result = await query(
      `INSERT INTO mentorship
         (id, student_id, mentor_id, session_date, duration_minutes, topic, status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending')
       RETURNING *`,
      [uuidv4(), req.user.id, mentor_id, session_date, duration_minutes, topic]
    );

    logger.info(`Mentorship session booked: ${result.rows[0].id}`);

    res.status(201).json({
      success: true,
      message: 'Session booked successfully. Mentor will confirm shortly.',
      data: { session: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/mentorship/my ────────────────────────────────────
const getMySessions = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT m.*, u.name AS mentor_name, u.email AS mentor_email
       FROM mentorship m
       JOIN users u ON u.id = m.mentor_id
       WHERE m.student_id = $1
       ORDER BY m.session_date DESC`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: { sessions: result.rows } });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/mentorship/mentor-sessions  (mentor only) ───────
const getMentorSessions = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT m.*, u.name AS student_name, u.email AS student_email
       FROM mentorship m
       JOIN users u ON u.id = m.student_id
       WHERE m.mentor_id = $1
       ORDER BY m.session_date ASC`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: { sessions: result.rows } });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/mentorship/:id/confirm  (mentor only) ─────────
const confirmSession = async (req, res, next) => {
  try {
    const { meeting_link } = req.body;

    const result = await query(
      `UPDATE mentorship
       SET status = 'confirmed', meeting_link = $1
       WHERE id = $2 AND mentor_id = $3
       RETURNING *`,
      [meeting_link || null, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Session not found or unauthorized', 404);
    }

    logger.info(`Session confirmed: ${req.params.id}`);
    res.status(200).json({
      success: true,
      message: 'Session confirmed.',
      data: { session: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/mentorship/:id/cancel ─────────────────────────
const cancelSession = async (req, res, next) => {
  try {
    const result = await query(
      `UPDATE mentorship
       SET status = 'cancelled'
       WHERE id = $1 AND (student_id = $2 OR mentor_id = $2)
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Session not found or unauthorized', 404);
    }

    res.status(200).json({ success: true, message: 'Session cancelled.' });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/mentorship/mentors ───────────────────────────────
const getAvailableMentors = async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, email FROM users WHERE role = 'mentor' AND is_verified = TRUE`
    );
    res.status(200).json({ success: true, data: { mentors: result.rows } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookSession,
  getMySessions,
  getMentorSessions,
  confirmSession,
  cancelSession,
  getAvailableMentors,
};
