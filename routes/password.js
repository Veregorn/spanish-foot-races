const express = require('express');
const router = express.Router();

// Require controller modules.
const passwordController = require('../controllers/passwordController');

// GET request for password confirmation.
router.get('/confirm-password', passwordController.showPasswordForm);
// POST request for password confirmation.
router.post('/confirm-password', passwordController.confirmPassword);

module.exports = router;
