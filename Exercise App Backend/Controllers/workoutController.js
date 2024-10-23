const Workout = require('../Models/workoutModel');
const Collaboration = require('../Models/CollaborationModel');
 const axios = require('axios');
const moment = require('moment');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");

exports.createWorkout = async (req, res) => {
  try {
    const { name, description, date, collaborationId } = req.body;

    // Check if a workout already exists for this client on this date
    const existingWorkout = await Workout.findOne({
      collaboration: collaborationId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (existingWorkout) {
      return res.status(400).json({ message: 'A workout already exists for this client on this date.' });
    }

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

    // Fetch client email
    const collaboration = await Collaboration.findById(collaborationId).populate('client');
    const clientEmail = collaboration.client.email;

    // Send email notification
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'New Workout Assigned',
      text: `A new workout "${name}" has been assigned to you for ${new Date(date).toDateString()}. Log in to your account to view the details.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
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

exports.getClientWorkoutByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const clientId = req.user._id;

    // Create start and end of the selected date in UTC
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    console.log('Searching for workout between:', startDate, 'and', endDate);
    console.log('Client ID:', clientId);

    // First, find the client's collaboration
    const collaboration = await mongoose.model('Collaboration').findOne({
      client: clientId,
      status: 'active'
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'No active collaboration found for this client'
      });
    }

    // Then find workout using date range and collaboration ID
    const workout = await Workout.findOne({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      collaboration: collaboration._id
    })
    .populate({
      path: 'collaboration',
      populate: {
        path: 'coach',
        select: 'firstName lastName profilePicture'
      }
    })
    .populate('exercises');

    console.log('Found workout:', workout);  

    if (!workout) {
      return res.status(404).json({ 
        success: false,
        message: 'No workout found for this date' 
      });
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Error in getClientWorkoutByDate:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout',
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