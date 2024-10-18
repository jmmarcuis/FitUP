const Workout = require('../Models/workoutModel');
const Collaboration = require('../Models/CollaborationModel');
const axios = require('axios');
const moment = require('moment');

exports.createWorkout = async (req, res) => {
  try {
    const { name, description, date, collaborationId } = req.body;
    const workout = new Workout({
      name,
      description,
      date,
      exercises: [],
      collaboration: collaborationId,
      createdBy: req.user._id
    });
    await workout.save();
    
    await Collaboration.findByIdAndUpdate(collaborationId, {
      $push: { workouts: workout._id }
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const { collaborationId } = req.params;
    const workouts = await Workout.find({ collaboration: collaborationId });
    res.json(workouts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getWorkoutsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const coachId = req.user._id;

    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();

    const collaborations = await Collaboration.find({ coach: coachId });
    const collaborationIds = collaborations.map(collab => collab._id);

    const workouts = await Workout.find({
      date: { $gte: startDate, $lte: endDate },
      collaboration: { $in: collaborationIds }
    }).populate({
      path: 'collaboration',
      select: 'client',
      populate: {
        path: 'client',
        select: 'firstName lastName'
      }
    });

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts: workouts
    });
  } catch (error) {
    console.error('Error in getWorkoutsByDate:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { name, description, date } = req.body;
    const workout = await Workout.findByIdAndUpdate(workoutId, {
      name,
      description,
      date
    }, { new: true });
    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    await Workout.findByIdAndDelete(workoutId);
    await Collaboration.updateOne(
      { workouts: workoutId },
      { $pull: { workouts: workoutId } }
    );
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseId, initialSets = 1 } = req.body;

    // Fetch exercise details from wger API
    const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/${exerciseId}/`);
    const exerciseData = response.data;

    const newExercise = {
      exerciseId,
      name: exerciseData.name,
      sets: Array(initialSets).fill({ reps: 0, weight: 0, RPE:0 })
    };

    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      { $push: { exercises: newExercise } },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateExerciseInWorkout = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.params;
    const { sets } = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, 'exercises._id': exerciseId },
      { $set: { 'exercises.$.sets': sets } },
      
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout or exercise not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addSetToExercise = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.params;
    const newSet = { reps: 0, weight: 0 };

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, 'exercises._id': exerciseId },
      { $push: { 'exercises.$.sets': newSet } },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout or exercise not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSetInExercise = async (req, res) => {
  try {
    const { workoutId, exerciseId, setIndex } = req.params;
    const { reps, weight, RPE } = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, 'exercises._id': exerciseId },
      { 
        $set: { 
          [`exercises.$[exercise].sets.${setIndex}.reps`]: reps,
          [`exercises.$[exercise].sets.${setIndex}.weight`]: weight,
          [`exercises.$[exercise].sets.${setIndex}.RPE`]: RPE
        } 
      },
      { 
        arrayFilters: [{ 'exercise._id': exerciseId }],
        new: true 
      }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout, exercise, or set not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSetFromExercise = async (req, res) => {
  try {
    const { workoutId, exerciseId, setIndex } = req.params;

    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, 'exercises._id': exerciseId },
      { $unset: { [`exercises.$[exercise].sets.${setIndex}`]: 1 } },
      { 
        arrayFilters: [{ 'exercise._id': exerciseId }],
        new: true 
      }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout, exercise, or set not found' });
    }

    // Remove the null element created by $unset
    await Workout.findOneAndUpdate(
      { _id: workoutId, 'exercises._id': exerciseId },
      { $pull: { 'exercises.$.sets': null } }
    );

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExerciseFromWorkout = async (req, res) => {
  try {
    const { workoutId, exerciseId } = req.params;

    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      { $pull: { exercises: { _id: exerciseId } } },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};