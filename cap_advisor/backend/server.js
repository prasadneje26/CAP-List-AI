const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { logger } = require('./src/utils/logger');
const { initEnv } = require('./src/config/env');
const { authenticate } = require('./src/middleware/auth');
const { globalErrorHandler } = require('./src/middleware/errorHandler');
const { authRateLimiter, generalRateLimiter, aiRateLimiter } = require('./src/middleware/rateLimiter');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const env = initEnv();

const authRoutes = require('./src/routes/auth.routes');
const collegesRoutes = require('./src/routes/colleges.routes');
const capRoutes = require('./src/routes/cap.routes');
const aiRoutes = require('./src/routes/ai.routes');
const pdfRoutes = require('./src/routes/pdf.routes');
const mentorshipRoutes = require('./src/routes/mentorship.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: logger.stream }));
app.use(generalRateLimiter);

app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRateLimiter, authRoutes);
app.use('/api/v1/colleges', collegesRoutes);
app.use('/api/v1/cap', authenticate, capRoutes);
app.use('/api/v1/ai', authenticate, aiRateLimiter, aiRoutes);
app.use('/api/v1/pdf', authenticate, pdfRoutes);
app.use('/api/v1/mentorship', mentorshipRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use(globalErrorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(env.PORT, () => {
    logger.info(`CAP Advisor backend listening on port ${env.PORT}`);
  });
}

const gracefulShutdown = () => {
  logger.info('Graceful shutdown initiated');
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;
