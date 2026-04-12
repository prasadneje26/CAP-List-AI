// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/classificationEngine.js
// ============================================================

/**
 * Classify each college as Dream / Target / Safe
 * based on the gap between student's percentile and college cutoff.
 *
 * Logic:
 *  Dream  → student percentile < cutoff  (will be a stretch)
 *  Target → student percentile is within ±SAFE_MARGIN of cutoff
 *  Safe   → student percentile > cutoff + SAFE_MARGIN (comfortable)
 */

const DREAM_THRESHOLD  = 0;     // student below cutoff → Dream
const TARGET_THRESHOLD = 3.0;   // within 3 percentile points above cutoff → Target
const SAFE_THRESHOLD   = 3.0;   // more than 3 points above cutoff → Safe

/**
 * Classify a single college for a student.
 * @param {number} studentPercentile
 * @param {number} collegeCutoff
 * @returns {{ classification: string, gap: number, confidence: number }}
 */
const classifyOne = (studentPercentile, collegeCutoff) => {
  const gap = parseFloat((studentPercentile - collegeCutoff).toFixed(2));

  let classification;
  let confidence;

  if (gap < DREAM_THRESHOLD) {
    // Student below cutoff — it's a stretch
    classification = 'Dream';
    // Confidence drops as the gap grows larger (more negative)
    confidence = Math.max(5, Math.round(50 + gap * 5)); // e.g. gap=-2 → 40%
  } else if (gap <= TARGET_THRESHOLD) {
    // Student at or just above cutoff — achievable
    classification = 'Target';
    confidence = Math.round(55 + gap * 8); // 55–79%
  } else {
    // Comfortably above cutoff — safe bet
    classification = 'Safe';
    const extra = Math.min(gap - TARGET_THRESHOLD, 10);
    confidence = Math.round(80 + extra * 1.5); // 80–95%
  }

  confidence = Math.min(95, Math.max(5, confidence));

  return { classification, gap, confidence };
};

/**
 * Classify an array of colleges for a given student percentile.
 * @param {Array}  colleges  — filtered college list (each has cutoff_percentile)
 * @param {number} percentile — student's percentile
 * @returns {Array} colleges with classification, gap, confidence added
 */
const classifyColleges = (colleges, percentile) => {
  return colleges.map((college) => {
    const { classification, gap, confidence } = classifyOne(
      parseFloat(percentile),
      parseFloat(college.cutoff_percentile)
    );

    return {
      ...college,
      classification,
      gap,
      confidence,
    };
  });
};

/**
 * Group colleges by classification bucket.
 * @param {Array} classifiedColleges
 * @returns {{ Dream: Array, Target: Array, Safe: Array }}
 */
const groupByClassification = (classifiedColleges) => {
  return classifiedColleges.reduce(
    (acc, college) => {
      acc[college.classification].push(college);
      return acc;
    },
    { Dream: [], Target: [], Safe: [] }
  );
};

/**
 * Validate classification balance — warn if any bucket is empty.
 */
const validateBalance = (groups) => {
  const warnings = [];
  if (groups.Dream.length  === 0) warnings.push('No Dream colleges found — consider lower percentile buffer');
  if (groups.Target.length === 0) warnings.push('No Target colleges — student may be above or below most cutoffs');
  if (groups.Safe.length   === 0) warnings.push('No Safe colleges — increase percentile buffer or broaden filters');
  return warnings;
};

module.exports = { classifyOne, classifyColleges, groupByClassification, validateBalance };
