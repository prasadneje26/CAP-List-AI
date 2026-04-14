const Joi = require('joi');
const { getStrategy, getCollegeInsight, chatResponse } = require('../services/ai.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const strategySchema = Joi.object({
  studentData: Joi.object().required(),
  capList: Joi.array().items(Joi.object()).required()
});

const insightSchema = Joi.object({
  studentData: Joi.object().required(),
  collegeItem: Joi.object().required()
});

const chatSchema = Joi.object({
  messages: Joi.array().items(Joi.object({ role: Joi.string().valid('user', 'assistant').required(), content: Joi.string().required() })).required(),
  studentContext: Joi.object().optional()
});

async function strategy(req, res, next) {
  try {
    const { error, value } = strategySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }
    const text = await getStrategy(value.studentData, value.capList);
    return res.status(200).json(successResponse({ strategy: text }, 'AI strategy generated successfully'));
  } catch (err) {
    return next(err);
  }
}

async function insight(req, res, next) {
  try {
    const { error, value } = insightSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }
    const insightText = await getCollegeInsight(value.studentData, value.collegeItem);
    return res.status(200).json(successResponse({ insight: insightText }, 'College insight generated successfully'));
  } catch (err) {
    return next(err);
  }
}

async function chat(req, res, next) {
  try {
    const { error, value } = chatSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }
    const reply = await chatResponse(value.messages, value.studentContext);
    return res.status(200).json(successResponse({ reply }, 'Chat response generated successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { strategy, insight, chat };
