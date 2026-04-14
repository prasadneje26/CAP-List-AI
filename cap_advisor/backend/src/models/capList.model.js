const { query } = require('../config/database');

async function saveCapList({ userId, percentile, category, branches, location, collegeType, resultData, aiStrategy }) {
  const result = await query(
    'INSERT INTO cap_lists(user_id, percentile, category, branches, location, college_type, result_data, ai_strategy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [userId, percentile, category, branches, location, collegeType, resultData, aiStrategy]
  );
  return result.rows[0];
}

async function getCapListsByUser(userId) {
  const result = await query('SELECT * FROM cap_lists WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

async function deleteCapList(id, userId) {
  const result = await query('DELETE FROM cap_lists WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
  return result.rows[0];
}

module.exports = { saveCapList, getCapListsByUser, deleteCapList };
