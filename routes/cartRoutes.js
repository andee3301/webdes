const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/cart', cartController.viewCart);
router.post('/cart/add/:menuItemId', cartController.addToCart);
router.post('/cart/update/:menuItemId', cartController.updateQuantity);
router.post('/cart/remove/:menuItemId', cartController.removeItem);

module.exports = router;
