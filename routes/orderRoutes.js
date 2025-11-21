const express = require('express');
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/checkout', requireAuth, orderController.checkoutPage);
router.post('/checkout', requireAuth, orderController.placeOrder);
router.get('/orders', requireAuth, orderController.listOrders);
router.get('/orders/:id', requireAuth, orderController.viewOrder);

module.exports = router;
