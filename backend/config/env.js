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

  const required = [
    'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
    'JWT_SECRET', 'AI_ENGINE_URL',
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`Warning: Missing env vars: ${missing.join(', ')}`);
  }
};

module.exports = { loadEnv };
