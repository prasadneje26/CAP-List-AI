// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/models/College.js
// ============================================================

const { query } = require('../config/db');

const College = {

  findAll: async (filters = {}) => {
    let sql    = 'SELECT * FROM colleges WHERE 1=1';
    const vals = [];
    let   idx  = 1;

    if (filters.college_type) {
      sql += ` AND college_type = $${idx++}`;
      vals.push(filters.college_type);
    }
    if (filters.district) {
      sql += ` AND district ILIKE $${idx++}`;
      vals.push(`%${filters.district}%`);
    }
    if (filters.min_rating) {
      sql += ` AND rating >= $${idx++}`;
      vals.push(filters.min_rating);
    }

    sql += ' ORDER BY rating DESC';
    const result = await query(sql, vals);
    return result.rows;
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM colleges WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  getCutoffs: async (collegeId, year = null) => {
    let sql    = 'SELECT * FROM cutoffs WHERE college_id = $1';
    const vals = [collegeId];
    if (year) { sql += ' AND year = $2'; vals.push(year); }
    sql += ' ORDER BY year DESC, round_number ASC';
    const result = await query(sql, vals);
    return result.rows;
  },
};

module.exports = College;
