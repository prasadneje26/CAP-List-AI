const { query } = require('../config/database');

async function createFeedback({ userId, rating, useful, suggestions, issues }) {
  const result = await query(
    'INSERT INTO feedback(user_id, rating, useful, suggestions, issues) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, rating, useful, suggestions, issues]
  );
  return result.rows[0];
}

async function createMentorshipRequest({ name, email, phone, percentile, category, message }) {
  const result = await query(
    'INSERT INTO mentorship_requests(name, email, phone, percentile, category, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, email, phone, percentile, category, message]
  );
  return result.rows[0];
}

module.exports = { createFeedback, createMentorshipRequest };
