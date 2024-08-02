const express = require('express');
const { register, login } = require('../Controllers/authController');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example of a protected route
router.get('/profile', protect, (req, res) => {
  res.send('Profile information');
});

module.exports = router;
