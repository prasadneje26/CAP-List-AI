// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/models/User.js
// ============================================================

const { query } = require('../config/db');

const User = {

  findById: async (id) => {
    const result = await query(
      'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  findByEmail: async (email) => {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  create: async ({ name, email, passwordHash, role = 'student' }) => {
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, is_verified, created_at',
      [name, email.toLowerCase(), passwordHash, role]
    );
    return result.rows[0];
  },

  findAll: async (limit = 20, offset = 0) => {
    const result = await query(
      'SELECT id, name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  updateVerified: async (id) => {
    await query(
      'UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1',
      [id]
    );
  },
};

module.exports = User;
