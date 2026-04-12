// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/security/inputSanitizer.js
// ============================================================

const sanitizeHtml = require('sanitize-html');

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeHtml(value.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
  if (typeof value === 'object' && value !== null) {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  if (Array.isArray(obj)) return obj.map(sanitizeValue);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, sanitizeValue(v)])
  );
};

const sanitizeInput = (req, _res, next) => {
  if (req.body)   req.body   = sanitizeObject(req.body);
  if (req.query)  req.query  = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = { sanitizeInput };
