const express = require('express');
const { strategy, insight, chat } = require('../controllers/ai.controller');

const router = express.Router();
router.post('/strategy', strategy);
router.post('/insight', insight);
router.post('/chat', chat);

module.exports = router;
