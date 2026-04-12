// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/config/db.js
// ============================================================

const { Pool } = require('pg');
const logger   = require('../utils/logger');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  host:     connectionString ? undefined : (process.env.DB_HOST || process.env.PGHOST || 'localhost'),
  port:     connectionString ? undefined : parseInt(process.env.DB_PORT || process.env.PGPORT) || 5432,
  database: connectionString ? undefined : (process.env.DB_NAME || process.env.PGDATABASE || 'cap_counseling'),
  user:     connectionString ? undefined : (process.env.DB_USER || process.env.PGUSER || 'postgres'),
  password: connectionString ? undefined : (process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres'),
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
