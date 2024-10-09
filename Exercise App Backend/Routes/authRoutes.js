const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
 
router.post('/register', authController.register);
router.post('/verify', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/resend-otp', authController.resendOTP);
router.post('/cancel-registration', authController.cancelRegistration);
router.get('/verify-token', authController.verifyToken);
module.exports = router;
