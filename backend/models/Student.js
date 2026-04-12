// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/models/Student.js
// ============================================================

const { query } = require('../config/db');

const Student = {

  // Find student by user_id
  findByUserId: async (userId) => {
    const result = await query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  // Find student by student id
  findById: async (id) => {
    const result = await query(
      'SELECT * FROM students WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Get full profile with user info
  getFullProfile: async (userId) => {
    const result = await query(
      `SELECT s.*, u.name, u.email
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  // Get all predictions for a student
  getPredictions: async (studentId) => {
    const result = await query(
      `SELECT p.*, c.name AS college_name, c.code, c.location
       FROM predictions p
       JOIN colleges c ON c.id = p.college_id
       WHERE p.student_id = $1
       ORDER BY p.cap_order ASC`,
      [studentId]
    );
    return result.rows;
  },
};

module.exports = Student;
