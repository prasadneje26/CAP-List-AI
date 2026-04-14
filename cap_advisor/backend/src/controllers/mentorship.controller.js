const Joi = require('joi');
const { createMentorshipRequest } = require('../models/feedback.model');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const mentorshipSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  percentile: Joi.number().min(0).max(100).optional(),
  category: Joi.string().valid('Open', 'OBC', 'SC', 'ST', 'NT', 'VJNT').optional(),
  message: Joi.string().trim().required()
});

async function requestMentorship(req, res, next) {
  try {
    const { error, value } = mentorshipSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }
    const request = await createMentorshipRequest(value);
    return res.status(201).json(successResponse({ request }, 'Mentorship request submitted successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { requestMentorship };
