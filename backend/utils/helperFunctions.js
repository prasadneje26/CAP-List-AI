// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/utils/helperFunctions.js
// ============================================================

// Round to N decimal places
const round = (value, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

// Paginate an array
const paginate = (array, page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  return {
    data:  array.slice(start, start + limit),
    total: array.length,
    page,
    limit,
    pages: Math.ceil(array.length / limit),
  };
};

// Format currency in INR
const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

// Generate a random OTP
const generateOTP = (length = 6) =>
  Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();

// Delay helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe JSON parse
const safeJSON = (str, fallback = null) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

module.exports = { round, paginate, formatINR, generateOTP, sleep, safeJSON };
