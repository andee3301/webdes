const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getHome);
router.get('/admin', menuController.getAdminDashboard);
router.get('/admin/add', menuController.getAddForm);
router.post('/admin/add', menuController.createItem);

module.exports = router;
