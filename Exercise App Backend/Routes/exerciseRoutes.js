const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { protect } = require('../Middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Fetch exercises by muscle group
router.get('/by-muscle/:muscle', exerciseController.getExercisesByMuscle);

// Get list of all available muscle groups
router.get('/muscle-groups', exerciseController.getMuscleGroups);

// Search for specific exercise
router.get('/search', exerciseController.searchExercise);

// Fetch all exercises from the database
router.get('/', exerciseController.getExercises);

module.exports = router;