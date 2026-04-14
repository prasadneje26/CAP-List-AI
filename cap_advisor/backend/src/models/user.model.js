const { query } = require('../config/database');

async function findUserByEmail(email) {
  const result = await query('SELECT id, name, email, phone, password_hash, refresh_token_hash FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query('SELECT id, name, email, phone FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createUser({ name, email, passwordHash, phone }) {
  const result = await query(
    'INSERT INTO users(name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, created_at',
    [name, email, passwordHash, phone]
  );
  return result.rows[0];
}

async function updateRefreshTokenHash(userId, refreshTokenHash) {
  await query('UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2', [refreshTokenHash, userId]);
}

async function clearRefreshTokenHash(userId) {
  await query('UPDATE users SET refresh_token_hash = NULL, updated_at = NOW() WHERE id = $1', [userId]);
}

module.exports = { findUserByEmail, findUserById, createUser, updateRefreshTokenHash, clearRefreshTokenHash };
