// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/app.js
// ============================================================

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const { helmetConfig }    = require('./security/helmetConfig');
const { corsConfig }      = require('./security/corsConfig');
const { rateLimiter }     = require('./middleware/rateLimiter');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const { sanitizeInput }   = require('./security/inputSanitizer');
const logger              = require('./utils/logger');

// Route imports
const authRoutes           = require('./routes/authRoutes');
const studentRoutes        = require('./routes/studentRoutes');
const collegeRoutes        = require('./routes/collegeRoutes');
const predictionRoutes     = require('./routes/predictionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const feedbackRoutes       = require('./routes/feedbackRoutes');
const mentorshipRoutes     = require('./routes/mentorshipRoutes');
const pdfRoutes            = require('./routes/pdfRoutes');

const app = express();

// ── Security middleware ──────────────────────────────────────
app.use(helmetConfig);
app.use(corsConfig);

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Input sanitization ───────────────────────────────────────
app.use(sanitizeInput);

// ── Rate limiting ────────────────────────────────────────────
app.use('/api/', rateLimiter);

// ── Request logger ───────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl} — ${req.ip}`);
  next();
});

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CAP Counseling Backend',
    version: '1.0.0',
  });
});

// ── API routes ───────────────────────────────────────────────
app.use('/api/auth',            authRoutes);
app.use('/api/student',         studentRoutes);
app.use('/api/colleges',        collegeRoutes);
app.use('/api/predict',         predictionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/feedback',        feedbackRoutes);
app.use('/api/mentorship',      mentorshipRoutes);
app.use('/api/pdf',             pdfRoutes);

if (process.env.SERVE_FRONTEND === 'true' || process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../frontend-web/dist');
  const indexFile = path.join(frontendDist, 'index.html');

  if (fs.existsSync(indexFile)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }
      return res.sendFile(indexFile);
    });
  } else {
    logger.warn(`Frontend build not found at ${frontendDist}`);
  }
}

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
