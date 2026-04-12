// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/config/env.js
// ============================================================

const path = require('path');
const fs   = require('fs');

const loadEnv = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  } else {
    require('dotenv').config();
  }

  const required = ['JWT_SECRET', 'AI_ENGINE_URL'];
  const hasDatabaseConfig = process.env.DATABASE_URL || (
    process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD
  ) || (
    process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD
  );

  const missing = required.filter((key) => !process.env[key]);
  if (!hasDatabaseConfig) {
    missing.push('DATABASE_URL or PostgreSQL connection variables');
  }
  if (missing.length > 0) {
    console.warn(`Warning: Missing env vars: ${missing.join(', ')}`);
  }
};

module.exports = { loadEnv };
