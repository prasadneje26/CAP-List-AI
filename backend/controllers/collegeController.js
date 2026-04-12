
const { query }    = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');

// GET /api/colleges
const getAllColleges = async (req, res, next) => {
  try {
    const { college_type, district, min_rating, search } = req.query;

    let sql    = 'SELECT * FROM colleges WHERE 1=1';
    const vals = [];
    let   idx  = 1;

    if (college_type) { sql += ` AND college_type = $${idx++}`;       vals.push(college_type); }
    if (district)     { sql += ` AND district ILIKE $${idx++}`;        vals.push(`%${district}%`); }
    if (min_rating)   { sql += ` AND rating >= $${idx++}`;             vals.push(parseFloat(min_rating)); }
    if (search)       { sql += ` AND name ILIKE $${idx++}`;            vals.push(`%${search}%`); }

    sql += ' ORDER BY rating DESC';

    const result = await query(sql, vals);
    res.status(200).json({ success: true, data: { colleges: result.rows, total: result.rows.length } });
  } catch (err) { next(err); }
};

// GET /api/colleges/:id
const getCollegeById = async (req, res, next) => {
  try {
    const college = await query('SELECT * FROM colleges WHERE id = $1', [req.params.id]);
    if (!college.rows.length) throw new AppError('College not found', 404);

    const cutoffs = await query(
      'SELECT * FROM cutoffs WHERE college_id = $1 ORDER BY year DESC, branch ASC',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      data: { college: college.rows[0], cutoffs: cutoffs.rows },
    });
  } catch (err) { next(err); }
};

// GET /api/colleges/:id/cutoffs
const getCollegeCutoffs = async (req, res, next) => {
  try {
    const { year, branch, category } = req.query;
    let sql    = 'SELECT * FROM cutoffs WHERE college_id = $1';
    const vals = [req.params.id];
    let   idx  = 2;

    if (year)     { sql += ` AND year = $${idx++}`;             vals.push(year); }
    if (branch)   { sql += ` AND branch ILIKE $${idx++}`;       vals.push(`%${branch}%`); }
    if (category) { sql += ` AND category = $${idx++}`;         vals.push(category); }

    sql += ' ORDER BY year DESC';
    const result = await query(sql, vals);

    res.status(200).json({ success: true, data: { cutoffs: result.rows } });
  } catch (err) { next(err); }
};

module.exports = { getAllColleges, getCollegeById, getCollegeCutoffs };
