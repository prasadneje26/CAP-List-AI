const { query } = require('../config/database');

async function getCollegeById(id) {
  const collegeResult = await query('SELECT * FROM colleges WHERE id = $1', [id]);
  const college = collegeResult.rows[0];
  if (!college) return null;

  const branches = await query('SELECT * FROM college_branches WHERE college_id = $1', [id]);
  return { ...college, branches: branches.rows };
}

async function getColleges({ location, type, branch }) {
  const filters = [];
  const params = [];
  let idx = 1;

  if (location) {
    filters.push(`location ILIKE $${idx++}`);
    params.push(`%${location}%`);
  }
  if (type) {
    filters.push(`type = $${idx++}`);
    params.push(type);
  }
  if (branch) {
    filters.push(`id IN (SELECT college_id FROM college_branches WHERE branch ILIKE $${idx++})`);
    params.push(`%${branch}%`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await query(`SELECT * FROM colleges ${whereClause} ORDER BY rating DESC NULLS LAST`, params);
  return result.rows;
}

async function searchBranches(branches) {
  const result = await query('SELECT DISTINCT branch FROM college_branches WHERE branch = ANY($1)', [branches]);
  return result.rows.map((r) => r.branch);
}

module.exports = { getCollegeById, getColleges, searchBranches };
