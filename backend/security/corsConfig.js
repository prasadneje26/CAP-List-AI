// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/security/corsConfig.js
// ============================================================

const cors = require('cors');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const allowAllOrigins = process.env.NODE_ENV !== 'production' || process.env.ALLOWED_ORIGINS === '*';

const corsConfig = cors({
  origin: (origin, callback) => {
    if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = { corsConfig };
