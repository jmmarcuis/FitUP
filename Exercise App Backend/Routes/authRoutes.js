const express = require('express');
const router = express.Router();
const { register, completeProfile, login, fetchUser, updateUser, uploadProfilePicture } = require('../Controllers/authController');
const { protect } = require('../Middleware/authMiddleware');

router.post('/register', register); // Register a User
router.post('/complete-profile', protect, completeProfile); // Complete the Registered User profile
router.post('/login', login); // Authenticate user
router.get('/profile', protect, fetchUser); // Fetch user profile
router.put('/profile', protect, updateUser); // Update user profile
router.post('/profile-picture', protect, uploadProfilePicture); // Upload profile picture

module.exports = router;