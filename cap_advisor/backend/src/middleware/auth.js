const { verifyAccessToken } = require('../utils/jwtHelper');
const { errorResponse } = require('../utils/responseHelper');

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('Authentication required')); 
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }
}

module.exports = { authenticate };
