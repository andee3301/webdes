const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/wishlist', requireAuth, wishlistController.list);
router.post('/wishlist/:menuItemId/add', requireAuth, wishlistController.add);
router.post('/wishlist/:menuItemId/remove', requireAuth, wishlistController.remove);

module.exports = router;
