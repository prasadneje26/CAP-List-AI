const Joi = require('joi');
const { errorResponse } = require('../utils/responseHelper');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((detail) => detail.message);
      return res.status(422).json(errorResponse('Validation error', details));
    }
    return next();
  };
}

module.exports = { validate };
