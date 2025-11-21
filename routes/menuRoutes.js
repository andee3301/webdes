const express = require('express');
const menuController = require('../controllers/menuController');
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', menuController.getHome);
router.get('/:id', menuController.getMenuItem);
router.post('/:id/reviews', requireAuth, reviewController.create);

module.exports = router;
