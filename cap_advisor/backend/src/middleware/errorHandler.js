const { logger } = require('../utils/logger');
const { errorResponse } = require('../utils/responseHelper');

function globalErrorHandler(err, req, res, next) {
  logger.error(err.stack || err.message || err);
  const statusCode = err.status || 500;
  return res.status(statusCode).json(errorResponse(err.message || 'Internal server error'));
}

module.exports = { globalErrorHandler };
