const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { protect } = require('../Middleware/authMiddleware');

// All routes are now protected
router.use(protect);

router.get('/workouts', workoutController.getAllWorkouts);
router.get('/exercises', workoutController.getExercises);
router.post('/workouts', workoutController.createWorkout);
router.post('/workouts/:id/exercises', workoutController.addExerciseToWorkout);
router.delete('/workouts/:id', workoutController.deleteWorkout);
router.put('/workouts/:id', workoutController.updateWorkout);

module.exports = router;