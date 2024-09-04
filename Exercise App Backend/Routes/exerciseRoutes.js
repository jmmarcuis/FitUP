const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { protect } = require('../Middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Search for specific exercise
router.get('/search', exerciseController.searchExercise);

 

module.exports = router;