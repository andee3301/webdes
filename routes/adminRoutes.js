const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/', adminController.dashboard);

router.get('/menu-items', adminController.listMenuItems);
router.get('/menu-items/new', adminController.newMenuItemForm);
router.post('/menu-items', adminController.createMenuItem);
router.get('/menu-items/:id/edit', adminController.editMenuItemForm);
router.post('/menu-items/:id', adminController.updateMenuItem);
router.post('/menu-items/:id/delete', adminController.deleteMenuItem);

router.get('/orders', adminController.listOrders);
router.get('/orders/:id', adminController.viewOrder);
router.post('/orders/:id/status', adminController.updateOrderStatus);

router.get('/reviews', adminController.listReviews);
router.post('/reviews/:id/approve', adminController.approveReview);
router.post('/reviews/:id/reject', adminController.rejectReview);

module.exports = router;
