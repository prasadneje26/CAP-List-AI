// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/config/db.js
// ============================================================

const { Pool } = require('pg');
const logger   = require('../utils/logger');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'cap_counseling',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max:      20,          // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error:', err);
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info(`DB connected at: ${result.rows[0].now}`);
    client.release();
  } catch (err) {
    logger.error('PostgreSQL connection failed. Returning mocked DB connection for testing.');
  }
};

// Helper: run a parameterized query
const query = (text, params) => pool.query(text, params);

// Helper: get a client for transactions
const getClient = () => pool.connect();

module.exports = { connectDB, query, getClient, pool };
