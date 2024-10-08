// const express = require('express');
// const router = express.Router();
// const workoutController = require('../controllers/workoutController');
// const { protect } = require('../Middleware/authMiddleware');

// // All routes are protected
// router.use(protect);

// // Workout routes
// router.post('/', workoutController.createWorkout);
// router.get('/date/:date', workoutController.getWorkoutsByDate);
// router.get('/:id', workoutController.getWorkout);
// router.put('/:id', workoutController.updateWorkout);
// router.delete('/:id', workoutController.deleteWorkout);

// // Exercise and set management
// router.post('/add-exercise', workoutController.addExerciseToWorkout);
// router.post('add-set',workoutController.addSetToExercise)
// router.put('/update-set', workoutController.updateSet);
// router.delete('/delete-set', workoutController.deleteSetFromExercise);   

// module.exports = router;
