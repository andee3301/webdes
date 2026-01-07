const express = require('express');
const menuController = require('../controllers/menuController');
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Redirect /menu to /shop (shop is the only place to see all offers)
router.get('/', (req, res) => res.redirect('/shop'));

// Keep individual item detail pages at /menu/:id
router.get('/:id', menuController.getMenuItem);
router.post('/:id/reviews', requireAuth, reviewController.create);

module.exports = router;
