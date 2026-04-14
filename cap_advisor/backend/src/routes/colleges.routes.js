const express = require('express');
const { fetchColleges, fetchCollegeById } = require('../controllers/colleges.controller');

const router = express.Router();
router.get('/', fetchColleges);
router.get('/:id', fetchCollegeById);

module.exports = router;
