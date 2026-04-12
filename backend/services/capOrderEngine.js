// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/capOrderEngine.js
// ============================================================

/**
 * CAP Preference List Optimizer
 *
 * Maharashtra CAP rules:
 * - Student fills an ordered preference list
 * - Higher preference = tried first
 * - Once allotted, lower preferences are ignored
 *
 * Strategy:
 * 1. Safe colleges last (guaranteed, use as safety net)
 * 2. Target colleges in middle (most likely admits)
 * 3. Dream colleges at top (low probability but high reward)
 * 4. Within each bucket, sort by ranking_score DESC
 */

/**
 * Generate optimized CAP order from ranked+classified colleges.
 * @param {Object} groups   — { Dream: [], Target: [], Safe: [] }
 * @param {Object} options
 * @param {number} options.maxEntries  — max entries in CAP list (default 30)
 * @param {number} options.dreamSlots  — max dream colleges (default 5)
 * @param {number} options.targetSlots — max target colleges (default 15)
 * @param {number} options.safeSlots   — max safe colleges (default 10)
 * @returns {Array} ordered CAP list with cap_order assigned
 */
const generateCAPOrder = (
  groups,
  {
    maxEntries  = 30,
    dreamSlots  = 5,
    targetSlots = 15,
    safeSlots   = 10,
  } = {}
) => {
  const sortByScore = (arr) =>
    [...arr].sort((a, b) => b.ranking_score - a.ranking_score);

  const dreams  = sortByScore(groups.Dream).slice(0, dreamSlots);
  const targets = sortByScore(groups.Target).slice(0, targetSlots);
  const safes   = sortByScore(groups.Safe).slice(0, safeSlots);

  // CAP order: Dreams first, then Targets, then Safes
  const ordered = [...dreams, ...targets, ...safes].slice(0, maxEntries);

  return ordered.map((college, index) => ({
    cap_order:      index + 1,
    college_id:     college.id,
    college_name:   college.name,
    college_code:   college.code,
    branch:         college.branch,
    classification: college.classification,
    ranking_score:  college.ranking_score,
    cutoff_percentile: college.cutoff_percentile,
    confidence:     college.confidence,
    gap:            college.gap,
    annual_fees:    college.annual_fees,
    district:       college.district,
    strategy_note:  getStrategyNote(college.classification, college.gap),
  }));
};

/**
 * Human-readable strategy note for each college.
 */
const getStrategyNote = (classification, gap) => {
  if (classification === 'Dream') {
    return `Stretch goal — ${Math.abs(gap).toFixed(1)} points below your percentile. Keep this high as a reach.`;
  }
  if (classification === 'Target') {
    return `Good match — you are ${gap.toFixed(1)} points above cutoff. High admission probability.`;
  }
  return `Safe choice — you are ${gap.toFixed(1)} points above cutoff. Include as your safety net.`;
};

/**
 * Validate CAP list — warn if too few entries or imbalanced.
 */
const validateCAPList = (capList) => {
  const warnings = [];

  if (capList.length < 10) {
    warnings.push('CAP list has fewer than 10 entries — add more colleges for safety.');
  }

  const dreamCount  = capList.filter((c) => c.classification === 'Dream').length;
  const targetCount = capList.filter((c) => c.classification === 'Target').length;
  const safeCount   = capList.filter((c) => c.classification === 'Safe').length;

  if (safeCount === 0) {
    warnings.push('No Safe colleges in list — add at least 3 safe options.');
  }
  if (targetCount === 0) {
    warnings.push('No Target colleges — list may be too aspirational.');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    summary: { dreamCount, targetCount, safeCount, total: capList.length },
  };
};

module.exports = { generateCAPOrder, validateCAPList, getStrategyNote };
