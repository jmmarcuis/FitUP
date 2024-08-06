const Workout = require('../models/workoutModel');
const Exercise = require('../models/exerciseModel');
const { fetchExercises } = require('../Services/exerciseAPIFetch');

// Get all workouts for a user
exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).populate('exercises.exercise');
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch exercises from API
exports.getExercises = async (req, res) => {
  try {
    const exercises = await fetchExercises(req.query);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new workout
exports.createWorkout = async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user._id
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add an exercise to a workout
exports.addExerciseToWorkout = async (req, res) => {
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
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
   
    if (!workout) {
      return res.status(404).json({ message: "Workout not found or not authorized to delete" });
    }
   
    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
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
};