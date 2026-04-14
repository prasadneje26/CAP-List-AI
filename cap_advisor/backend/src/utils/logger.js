const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

logger.stream = {
  write(message) {
    logger.info(message.trim());
  }
};

module.exports = { logger };
