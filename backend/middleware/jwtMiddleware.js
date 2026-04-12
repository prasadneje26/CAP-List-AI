// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/middleware/jwtMiddleware.js
// ============================================================

const jwt = require('jsonwebtoken');

const signToken = (payload, expiresIn = '1d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const verifyJwt = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

const decodeJwt = (token) =>
  jwt.decode(token);

module.exports = { signToken, verifyJwt, decodeJwt };
