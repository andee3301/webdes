const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/about', pageController.getAbout);
router.get('/journal', pageController.getJournal);

module.exports = router;
