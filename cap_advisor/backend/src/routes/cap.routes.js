const express = require('express');
const { generateCap, getHistory, removeCap } = require('../controllers/cap.controller');

const router = express.Router();
router.post('/generate', generateCap);
router.get('/history', getHistory);
router.delete('/:id', removeCap);

module.exports = router;
