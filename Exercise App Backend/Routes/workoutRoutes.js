const express = require('express');
const router = express.Router();
const Workout = require('../models/workoutModel');
const Exercise = require('../models/exerciseModel');
const { fetchExercises } = require('../Services/exerciseAPIFetch');
const { protect } = require('../Middleware/authMiddleware');

// All routes are now protected
router.use(protect);

//Fetch exercuses from API
// Get all workouts for a user
router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).populate('exercises.exercise');
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch exercises from API
router.get('/exercises', async (req, res) => {
  try {
    const exercises = await fetchExercises(req.query);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//CRUD OPERATIONS
// Create a new workout
router.post('/workouts', async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user._id  // Add the user ID from the authenticated request
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add an exercise to a workout
router.post('/workouts/:id/exercises', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found or unauthorized' });
    }

    // First, check if the exercise exists in the database, if not, create it
    let exercise = await Exercise.findOne({ name: req.body.name });
    if (!exercise) {
      exercise = new Exercise(req.body);
      await exercise.save();
    }

    // Add the exercise to the workout
    workout.exercises.push({
      exercise: exercise._id,
      sets: req.body.sets,
      reps: req.body.reps,
      weight: req.body.weight,
      rpe: req.body.rpe,
      notes: req.body.notes
    });

    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a workout
router.delete('/workouts/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found or not authorized to delete" });
    }
    
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a workout
router.put('/workouts/:id', protect, async (req, res) => {
  try {
    const { title, date, exercises } = req.body;
    
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, date, exercises },
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: "Workout not found or not authorized to update" });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;