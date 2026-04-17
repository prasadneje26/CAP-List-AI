// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/filteringEngine.js
// ============================================================

const { query } = require('../config/db');

/**
 * Filter colleges from DB based on student preferences.
 * Returns colleges with their latest cutoff for the student's
 * category + exam type.
 */
const filterColleges = async ({
  percentile,
  exam_type,
  category,
  branch_preferences = [],
  location_preferences = [],
  college_type,
  budget_max,
  year = 2025,
  percentile_buffer = 15, // include colleges within this range below student percentile
}) => {
  // Build dynamic WHERE clauses
  const conditions = [];
  const params     = [];
  let   idx        = 1;

  // Always filter by exam type and category
  conditions.push(`cu.exam_type = $${idx++}`);
  params.push(exam_type);

  conditions.push(`cu.category = $${idx++}`);
  params.push(category);

  conditions.push(`cu.year = $${idx++}`);
  params.push(year);

  // Only colleges where cutoff is reachable (student percentile + buffer)
  conditions.push(`cu.cutoff_percentile <= $${idx++}`);
  params.push(parseFloat(percentile) + percentile_buffer);

  // Branch filter
  if (branch_preferences && branch_preferences.length > 0) {
    const placeholders = branch_preferences.map(() => `$${idx++}`).join(', ');
    conditions.push(`cu.branch ILIKE ANY(ARRAY[${placeholders}])`);
    branch_preferences.forEach((b) => params.push(`%${b}%`));
  }

  // Location filter
  if (location_preferences && location_preferences.length > 0) {
    const placeholders = location_preferences.map(() => `$${idx++}`).join(', ');
    conditions.push(`c.district ILIKE ANY(ARRAY[${placeholders}])`);
    location_preferences.forEach((l) => params.push(`%${l}%`));
  }

  // College type filter
  if (college_type && college_type !== 'Any') {
    conditions.push(`c.college_type = $${idx++}`);
    params.push(college_type);
  }

  // Budget filter
  if (budget_max) {
    conditions.push(`c.annual_fees <= $${idx++}`);
    params.push(budget_max);
  }

  const whereClause = conditions.join(' AND ');

  const result = await query(
    `SELECT DISTINCT ON (c.id, cu.branch)
       c.id,
       c.name,
       c.code,
       c.location,
       c.district,
       c.university,
       c.college_type,
       c.rating,
       c.placement_score,
       c.annual_fees,
       c.total_seats,
       c.is_autonomous,
       cu.branch,
       cu.category,
       cu.cutoff_percentile,
       cu.seats_available,
       cu.round_number
     FROM colleges c
     JOIN cutoffs cu ON cu.college_id = c.id
     WHERE ${whereClause}
     ORDER BY c.id, cu.branch, cu.round_number ASC, cu.cutoff_percentile DESC, c.rating DESC`,
    params
  );

  return result.rows;
};

/**
 * Quick filter — pass raw college+cutoff array (no DB call).
 * Used after AI prediction to re-filter with predicted cutoffs.
 */
const filterFromList = (colleges, { percentile, percentile_buffer = 15 }) => {
  return colleges.filter(
    (c) => c.cutoff_percentile <= parseFloat(percentile) + percentile_buffer
  );
};

module.exports = { filterColleges, filterFromList };
