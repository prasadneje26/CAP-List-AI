const { getCollegeById, getColleges } = require('../models/college.model');
const { successResponse, errorResponse } = require('../utils/responseHelper');

async function fetchColleges(req, res, next) {
  try {
    const colleges = await getColleges({ location: req.query.location, type: req.query.type, branch: req.query.branch });
    return res.status(200).json(successResponse({ colleges }, 'Colleges retrieved successfully'));
  } catch (err) {
    return next(err);
  }
}

async function fetchCollegeById(req, res, next) {
  try {
    const college = await getCollegeById(req.params.id);
    if (!college) {
      return res.status(404).json(errorResponse('College not found'));
    }
    return res.status(200).json(successResponse({ college }, 'College retrieved successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { fetchColleges, fetchCollegeById };
