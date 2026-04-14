const express = require('express');
const { submitFeedback } = require('../controllers/feedback.controller');

const router = express.Router();
router.post('/', submitFeedback);

module.exports = router;
