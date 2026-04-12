// ============================================================
// File: backend/models/Feedback.js
// ============================================================
const { query } = require('../config/db');

const Feedback = {
  create: async ({ id, user_id, rating, message, category }) => {
    const result = await query(
      `INSERT INTO feedback (id, user_id, rating, message, category)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, user_id, rating, message, category]
    );
    return result.rows[0];
  },
  findByUser: async (userId) => {
    const result = await query(
      'SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },
};
module.exports = Feedback;
