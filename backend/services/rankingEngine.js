// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/rankingEngine.js
// ============================================================

/**
 * Ranking formula:
 *
 * Score = (college_rating    × 0.40)
 *       + (branch_priority   × 0.30)
 *       + (placement_score   × 0.20)
 *       + (type_bonus        × 0.10)
 *
 * All sub-scores normalised to 0–10 scale before weighting.
 */

const WEIGHTS = {
  college_rating:  0.40,
  branch_priority: 0.30,
  placement_score: 0.20,
  type_bonus:      0.10,
};

// Bonus points by college type (out of 10)
const TYPE_BONUS_MAP = {
  Government: 10,
  Aided:       8,
  Autonomous:  7,
  Unaided:     5,
  default:     5,
};

/**
 * Compute branch priority score (0–10) based on student's preferences.
 * First preference gets 10, second gets 8, third gets 6, rest get 4.
 * Unmatched branch gets 2 (still eligible, just not preferred).
 */
const getBranchPriorityScore = (collegeBranch, branchPreferences = []) => {
  if (!branchPreferences || branchPreferences.length === 0) return 5; // neutral

  const idx = branchPreferences.findIndex(
    (pref) => collegeBranch.toLowerCase().includes(pref.toLowerCase())
  );

  if (idx === -1) return 2;           // branch not in preferences
  if (idx === 0)  return 10;          // first choice
  if (idx === 1)  return 8;           // second choice
  if (idx === 2)  return 6;           // third choice
  return 4;                           // lower preference
};

/**
 * Normalise a rating (typically 0–10 scale already).
 */
const normalise = (value, min = 0, max = 10) => {
  if (value === null || value === undefined) return 5; // default mid-score
  return Math.min(10, Math.max(0, ((value - min) / (max - min)) * 10));
};

/**
 * Compute final ranking score for one college.
 * @param {Object} college          — college row with rating, placement_score etc.
 * @param {Array}  branchPreferences — student's ordered branch list
 * @returns {number} score 0–10
 */
const computeScore = (college, branchPreferences = []) => {
  const ratingScore    = normalise(college.rating, 0, 10);
  const branchScore    = getBranchPriorityScore(college.branch, branchPreferences);
  const placementScore = normalise(college.placement_score, 0, 100);
  const typeBonus      = (TYPE_BONUS_MAP[college.college_type] || TYPE_BONUS_MAP.default);

  const finalScore =
    ratingScore    * WEIGHTS.college_rating  +
    branchScore    * WEIGHTS.branch_priority +
    placementScore * WEIGHTS.placement_score +
    typeBonus      * WEIGHTS.type_bonus;

  return parseFloat(finalScore.toFixed(4));
};

/**
 * Rank an array of classified colleges.
 * Applies score within each classification bucket so Dream colleges
 * are ranked among Dreams, Target among Targets, Safe among Safes.
 *
 * @param {Array}  colleges         — classified college list
 * @param {Array}  branchPreferences
 * @returns {Array} colleges sorted by classification priority then score
 */
const rankColleges = (colleges, branchPreferences = []) => {
  const classOrder = { Dream: 1, Target: 2, Safe: 3 };

  const scored = colleges.map((college) => ({
    ...college,
    ranking_score: computeScore(college, branchPreferences),
  }));

  // Sort: classification order first, then score descending within bucket
  scored.sort((a, b) => {
    const classCompare = classOrder[a.classification] - classOrder[b.classification];
    if (classCompare !== 0) return classCompare;
    return b.ranking_score - a.ranking_score;
  });

  // Assign global rank
  return scored.map((college, index) => ({
    ...college,
    rank: index + 1,
  }));
};

/**
 * Get top N colleges per classification bucket.
 */
const topPerBucket = (rankedColleges, n = 5) => {
  const buckets = { Dream: [], Target: [], Safe: [] };

  rankedColleges.forEach((college) => {
    if (buckets[college.classification].length < n) {
      buckets[college.classification].push(college);
    }
  });

  return buckets;
};

module.exports = { rankColleges, computeScore, getBranchPriorityScore, topPerBucket };
