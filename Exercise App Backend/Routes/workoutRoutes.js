const express = require('express');
const router = express.Router();
const workoutController = require('../Controllers/workoutController');
const { verifyToken, isCoach } = require('../Middleware/authMiddleware');

router.post('/', verifyToken, isCoach, workoutController.createWorkout);
router.get('/collaboration/:collaborationId', verifyToken, workoutController.getWorkouts);
router.get('/by-date/:date', verifyToken, isCoach, workoutController.getWorkoutsByDate);
router.put('/:workoutId', verifyToken, isCoach, workoutController.updateWorkout);
router.delete('/:workoutId', verifyToken, isCoach, workoutController.deleteWorkout);

// Exercise routes
router.post('/:workoutId/exercises', verifyToken, isCoach, workoutController.addExerciseToWorkout);
router.put('/:workoutId/exercises/:exerciseId', verifyToken, isCoach, workoutController.updateExerciseInWorkout);
router.delete('/:workoutId/exercises/:exerciseId', verifyToken, isCoach, workoutController.deleteExerciseFromWorkout);

// New Set routes
router.post('/:workoutId/exercises/:exerciseId/sets', verifyToken, isCoach, workoutController.addSetToExercise);
router.put('/:workoutId/exercises/:exerciseId/sets/:setIndex', verifyToken, isCoach, workoutController.updateSetInExercise);
router.delete('/:workoutId/exercises/:exerciseId/sets/:setIndex', verifyToken, isCoach, workoutController.deleteSetFromExercise);

module.exports = router;