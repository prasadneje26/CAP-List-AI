const express = require('express');
const { requestMentorship } = require('../controllers/mentorship.controller');

const router = express.Router();
router.post('/request', requestMentorship);

module.exports = router;
