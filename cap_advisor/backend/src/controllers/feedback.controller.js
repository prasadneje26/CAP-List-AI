const Joi = require('joi');
const { createFeedback } = require('../models/feedback.model');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const feedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  useful: Joi.string().allow('', null),
  suggestions: Joi.string().allow('', null),
  issues: Joi.string().allow('', null)
});

async function submitFeedback(req, res, next) {
  try {
    const { error, value } = feedbackSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }

    const feedback = await createFeedback({ userId: req.user?.sub, ...value });
    return res.status(201).json(successResponse({ feedback }, 'Feedback submitted successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { submitFeedback };
