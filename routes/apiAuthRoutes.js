const express = require('express');
const apiAuthController = require('../controllers/apiAuthController');
const { requireApiAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', apiAuthController.register);
router.post('/login', apiAuthController.login);
router.get('/me', requireApiAuth, apiAuthController.me);

module.exports = router;
