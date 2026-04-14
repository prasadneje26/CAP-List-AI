const { query } = require('../config/database');

const categoryCutoffMap = {
  Open: 'cutoff_open',
  OBC: 'cutoff_obc',
  SC: 'cutoff_sc',
  ST: 'cutoff_sc',
  NT: 'cutoff_nt',
  VJNT: 'cutoff_vjnt'
};

function classify(percentile, cutoff) {
  const diff = Number(percentile) - Number(cutoff);
  if (diff < -2) return 'Dream';
  if (diff <= 2) return 'Target';
  return 'Safe';
}

function getProbability(percentile, cutoff) {
  const diff = Number(percentile) - Number(cutoff);
  if (diff < -8) return { pct: 12, label: 'Low', color: '#dc2626' };
  if (diff < -2) return { pct: 30, label: 'Moderate', color: '#f59e0b' };
  if (diff <= 2) return { pct: 60, label: 'Good', color: '#fb923c' };
  if (diff <= 8) return { pct: 82, label: 'High', color: '#4ade80' };
  return { pct: 95, label: 'Very High', color: '#22c55e' };
}

function calculateScore({ rating = 0, branchPriority = 5, placementScore = 0, collegeType = 'Non-Autonomous', selectedType }) {
  const normalizedRating = Number(rating) / 10.0;
  const branchFactor = 1 - Math.min(Math.max(branchPriority, 1), 10) / 10.0;
  const placementFactor = Number(placementScore) / 100.0;
  const typeBonus = selectedType && selectedType === collegeType ? 0.1 : 0.05;
  return Number((normalizedRating * 0.4 + branchFactor * 0.3 + placementFactor * 0.2 + typeBonus * 0.1).toFixed(4));
}

function normalizeBranchPriority(branches) {
  return branches.reduce((map, branch, index) => {
    map[branch] = index + 1;
    return map;
  }, {});
}

async function filterColleges({ branches, location, collegeType, category }) {
  const filters = [];
  const params = [];
  let idx = 1;

  if (location) {
    filters.push(`c.location ILIKE $${idx++}`);
    params.push(`%${location}%`);
  }
  if (collegeType) {
    filters.push(`c.type = $${idx++}`);
    params.push(collegeType);
  }
  if (branches && branches.length) {
    filters.push(`cb.branch = ANY($${idx++})`);
    params.push(branches);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const queryText = `SELECT c.*, cb.branch, cb.cutoff_open, cb.cutoff_obc, cb.cutoff_sc, cb.cutoff_nt, cb.cutoff_vjnt, cb.year FROM colleges c JOIN college_branches cb ON cb.college_id = c.id ${whereClause}`;
  const result = await query(queryText, params);
  return result.rows;
}

async function generateCAPList({ percentile, category, branches = [], location, collegeType }) {
  if (!branches || !branches.length) {
    throw new Error('At least one branch must be selected');
  }

  const branchPriority = normalizeBranchPriority(branches);
  const rawRows = await filterColleges({ branches, location, collegeType, category });
  const cutoffField = categoryCutoffMap[category] || 'cutoff_open';

  const results = rawRows.map((row) => {
    const cutoff = row[cutoffField] ?? row.cutoff_open ?? 0;
    const chance = getProbability(percentile, cutoff);
    const classification = classify(percentile, cutoff);
    return {
      collegeId: row.id,
      collegeName: row.name,
      location: row.location,
      type: row.type,
      branch: row.branch,
      cutoff: Number(cutoff),
      percentile: Number(percentile),
      category,
      aiChance: chance.label,
      probability: chance.pct,
      probabilityColor: chance.color,
      classification,
      rating: Number(row.rating || 0),
      placementScore: Number(row.placement_score || 0),
      branchPriority: branchPriority[row.branch] || branches.length,
      score: calculateScore({ rating: row.rating, branchPriority: branchPriority[row.branch] || branches.length, placementScore: row.placement_score, collegeType: row.type, selectedType: collegeType })
    };
  });

  const sorted = results.sort((a, b) => b.score - a.score || a.cutoff - b.cutoff);
  return sorted.map((item, index) => ({ ...item, capRank: index + 1 }));
}

module.exports = { classify, getProbability, generateCAPList, filterColleges };
