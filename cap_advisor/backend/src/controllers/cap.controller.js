const Joi = require('joi');
const { generateCAPList } = require('../services/capEngine.service');
const { saveCapList, getCapListsByUser, deleteCapList } = require('../models/capList.model');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const capSchema = Joi.object({
  percentile: Joi.number().min(0).max(100).required(),
  category: Joi.string().valid('Open', 'OBC', 'SC', 'ST', 'NT', 'VJNT').required(),
  branches: Joi.array().items(Joi.string().required()).min(1).required(),
  location: Joi.string().allow('', null),
  collegeType: Joi.string().valid('Autonomous', 'Non-Autonomous').allow('', null)
});

async function generateCap(req, res, next) {
  try {
    const { error, value } = capSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }

    const capList = await generateCAPList(value);
    const saved = await saveCapList({
      userId: req.user.sub,
      percentile: value.percentile,
      category: value.category,
      branches: value.branches,
      location: value.location,
      collegeType: value.collegeType,
      resultData: capList,
      aiStrategy: null
    });

    return res.status(201).json(successResponse({ capList, saved }, 'CAP list generated successfully'));
  } catch (err) {
    return next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await getCapListsByUser(req.user.sub);
    return res.status(200).json(successResponse({ history }, 'CAP history retrieved successfully'));
  } catch (err) {
    return next(err);
  }
}

async function removeCap(req, res, next) {
  try {
    const deleted = await deleteCapList(req.params.id, req.user.sub);
    if (!deleted) {
      return res.status(404).json(errorResponse('CAP entry not found'));
    }
    return res.status(200).json(successResponse({}, 'CAP entry deleted successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { generateCap, getHistory, removeCap };
