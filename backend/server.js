// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/server.js
// ============================================================

const app = require('./app');
const { connectDB } = require('./config/db');
const { loadEnv } = require('./config/env');
const logger = require('./utils/logger');

// Load environment variables
loadEnv();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();
    logger.info('PostgreSQL connected successfully');

    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force exit after 10s if not closed
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    // Unhandled rejection / exception guards
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
