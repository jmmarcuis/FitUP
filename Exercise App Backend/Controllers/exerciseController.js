const Exercise = require('../Models/exerciseModel');
// Example: Fetch all exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
