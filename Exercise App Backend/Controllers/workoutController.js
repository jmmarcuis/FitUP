const Workout = require('../models/workoutModel');

exports.createWorkout = async (req, res) => {
  try {
    const { title, date } = req.body;
    const userId = req.user._id;  

    const workout = new Workout({
      user: userId,
      title,
      date,
      exercises: []   
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getWorkouts = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const workouts = await Workout.find({ user: userId })
//       .populate('exercises.exercise')
//       .sort({ date: -1 });
//     res.json(workouts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getWorkoutsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    }).populate('exercises.exercise');

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercises.exercise');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { title, date, exercises } = req.body;
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workout.title = title;
    workout.date = date;
    workout.exercises = exercises.map(ex => ({
      exercise: ex.exerciseId,
      sets: ex.sets.map(set => ({
        reps: set.reps,
        weight: set.weight,
        completed: set.completed,
        rpe: set.rpe
      }))
    }));

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    await workout.deleteOne();
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.body;
    
    // Find the workout by ID
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the exercise exists (assuming you have an Exercise model)
    const exerciseExists = await Exercise.findById(exerciseId);
    if (!exerciseExists) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Add a new exercise with the initial set having valid default values
    workout.exercises.push({
      exercise: exerciseId,
      sets: [{
        reps: 1,
        weight: 0,
        completed: false,
        rpe: 1  
      }]
    });

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addSetToExercise = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.body;
    
    // Find the workout by ID and the specific exercise
    const workout = await Workout.findOne(
      { 
        _id: workoutId, 
        "exercises.exercise": exerciseId 
      }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout or exercise not found' });
    }

    // Find the index of the exercise
    const exerciseIndex = workout.exercises.findIndex(
      (ex) => ex.exercise.toString() === exerciseId
    );

    // Add a new set to the specified exercise, with valid initial values
    workout.exercises[exerciseIndex].sets.push({
      reps: 1,  // Minimum valid value
      weight: 0,  // Minimum valid value
      completed: false,
      rpe: 1  // Minimum valid value
    });

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid workout or exercise ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSetFromExercise = async (req, res) => {
  try {
    const { workoutId, exerciseIndex, setIndex } = req.body;

    // Find the workout by ID
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Check if the exercise exists
    if (!workout.exercises[exerciseIndex]) {
      return res.status(404).json({ message: 'Exercise not found in workout' });
    }

    // Check if the set exists
    if (!workout.exercises[exerciseIndex].sets[setIndex]) {
      return res.status(404).json({ message: 'Set not found in exercise' });
    }

    // Remove the set from the array
    workout.exercises[exerciseIndex].sets.splice(setIndex, 1);

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.updateSet = async (req, res) => {
  try {
    const { workoutId, exerciseIndex, setIndex, reps, weight, completed, rpe } = req.body;
    
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (!workout.exercises[exerciseIndex] || !workout.exercises[exerciseIndex].sets[setIndex]) {
      return res.status(404).json({ message: 'Exercise or Set not found' });
    }

    const set = workout.exercises[exerciseIndex].sets[setIndex];
    if (reps !== undefined) set.reps = reps;
    if (weight !== undefined) set.weight = weight;
    if (completed !== undefined) set.completed = completed;
    if (rpe !== undefined) set.rpe = rpe;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};