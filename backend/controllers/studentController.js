// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/studentController.js
// ============================================================

const { query }    = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');
const { v4: uuidv4 } = require('uuid');
const logger         = require('../utils/logger');

// ── POST /api/student/create ──────────────────────────────────

const createProfile = async (req, res, next) => {
  try {
    const {
      percentile,
      exam_type,
      category,
      gender,
      home_university,
      branch_preferences,
      location_preferences,
      college_type,
      budget_max,
    } = req.body;

    // One profile per user
    const existing = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    if (existing.rows.length > 0) {
      throw new AppError('Profile already exists. Use PUT /api/student/profile to update.', 409);
    }

    const result = await query(
      `INSERT INTO students
        (id, user_id, percentile, exam_type, category, gender,
         home_university, branch_preferences, location_preferences,
         college_type, budget_max)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        uuidv4(),
        req.user.id,
        percentile,
        exam_type,
        category,
        gender || null,
        home_university || null,
        branch_preferences || [],
        location_preferences || [],
        college_type || 'Any',
        budget_max || null,
      ]
    );

    logger.info(`Student profile created for user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: { student: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/student/profile ──────────────────────────────────

const getProfile = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.*, u.name, u.email, u.role
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Student profile not found. Please create one first.', 404);
    }

    res.status(200).json({
      success: true,
      data: { student: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/student/profile ──────────────────────────────────

const updateProfile = async (req, res, next) => {
  try {
    const {
      percentile,
      exam_type,
      category,
      gender,
      home_university,
      branch_preferences,
      location_preferences,
      college_type,
      budget_max,
    } = req.body;

    const result = await query(
      `UPDATE students SET
         percentile           = COALESCE($1, percentile),
         exam_type            = COALESCE($2, exam_type),
         category             = COALESCE($3, category),
         gender               = COALESCE($4, gender),
         home_university      = COALESCE($5, home_university),
         branch_preferences   = COALESCE($6, branch_preferences),
         location_preferences = COALESCE($7, location_preferences),
         college_type         = COALESCE($8, college_type),
         budget_max           = COALESCE($9, budget_max),
         updated_at           = NOW()
       WHERE user_id = $10
       RETURNING *`,
      [
        percentile,
        exam_type,
        category,
        gender,
        home_university,
        branch_preferences,
        location_preferences,
        college_type,
        budget_max,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      throw new AppError('Student profile not found', 404);
    }

    logger.info(`Student profile updated for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { student: result.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/student/all  (admin only) ───────────────────────

const getAllStudents = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT s.*, u.name, u.email
       FROM students s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const count = await query('SELECT COUNT(*) FROM students');

    res.status(200).json({
      success: true,
      data: {
        students: result.rows,
        pagination: {
          total: parseInt(count.rows[0].count),
          page,
          limit,
          pages: Math.ceil(count.rows[0].count / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/student/profile ───────────────────────────────

const deleteProfile = async (req, res, next) => {
  try {
    await query('DELETE FROM students WHERE user_id = $1', [req.user.id]);
    logger.info(`Student profile deleted for user: ${req.user.email}`);
    res.status(200).json({ success: true, message: 'Profile deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProfile, getProfile, updateProfile, getAllStudents, deleteProfile };
