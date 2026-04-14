const Joi = require('joi');
const { buildPdfBuffer } = require('../services/pdf.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const pdfSchema = Joi.object({
  studentData: Joi.object().required(),
  capList: Joi.array().items(Joi.object()).required(),
  aiStrategy: Joi.string().allow('', null)
});

async function generatePdf(req, res, next) {
  try {
    const { error, value } = pdfSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }
    const buffer = await buildPdfBuffer(value);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cap_advisor_report.pdf"');
    return res.status(200).send(buffer);
  } catch (err) {
    return next(err);
  }
}

module.exports = { generatePdf };
