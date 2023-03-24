const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.registerUser);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/regenerateToken', authController.regenerateOTP);
router.post('/login', authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;