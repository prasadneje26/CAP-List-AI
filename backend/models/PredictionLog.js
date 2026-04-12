// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/models/PredictionLog.js
// ============================================================

const { query } = require('../config/db');

const PredictionLog = {
  create: async ({ id, student_id, input_data, output_data, model_version, processing_time_ms }) => {
    const result = await query(
      `INSERT INTO prediction_logs
         (id, student_id, input_data, output_data, model_version, processing_time_ms)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [id, student_id, input_data, output_data, model_version, processing_time_ms]
    );
    return result.rows[0];
  },

  findByStudent: async (studentId, limit = 10) => {
    const result = await query(
      `SELECT * FROM prediction_logs
       WHERE student_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [studentId, limit]
    );
    return result.rows;
  },

  getStats: async () => {
    const result = await query(
      `SELECT
         COUNT(*) AS total_predictions,
         ROUND(AVG(processing_time_ms)) AS avg_processing_ms,
         MIN(created_at) AS first_prediction,
         MAX(created_at) AS latest_prediction
       FROM prediction_logs`
    );
    return result.rows[0];
  },
};

module.exports = PredictionLog;
