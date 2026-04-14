const express = require('express');
const { generatePdf } = require('../controllers/pdf.controller');

const router = express.Router();
router.post('/generate', generatePdf);

module.exports = router;
