const express = require('express');
const apiMenuController = require('../controllers/apiMenuController');

const router = express.Router();

router.get('/landing', apiMenuController.getLandingData);
router.get('/featured', apiMenuController.getFeatured);
router.get('/:slug', apiMenuController.getMenuItem);

module.exports = router;
