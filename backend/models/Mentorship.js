// ============================================================
// File: backend/models/Mentorship.js
// ============================================================
const { query } = require('../config/db');

const Mentorship = {
  findByStudent: async (studentId) => {
    const result = await query(
      `SELECT m.*, u.name AS mentor_name FROM mentorship m
       JOIN users u ON u.id = m.mentor_id
       WHERE m.student_id = $1 ORDER BY m.session_date DESC`,
      [studentId]
    );
    return result.rows;
  },
  findByMentor: async (mentorId) => {
    const result = await query(
      `SELECT m.*, u.name AS student_name FROM mentorship m
       JOIN users u ON u.id = m.student_id
       WHERE m.mentor_id = $1 ORDER BY m.session_date ASC`,
      [mentorId]
    );
    return result.rows;
  },
};
module.exports = Mentorship;
