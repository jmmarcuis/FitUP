const axios = require('axios');
const Exercise = require('../Models/exerciseModel');

// Search for specific exercise
exports.searchExercise = async (req, res) => {
  const { name } = req.query;
  const apiKey = process.env.API_NINJAS_KEY;
  if (!name) {
    return res.status(400).json({ error: 'Exercise name is required' });
  }
  try {
    const response = await axios.get('https://api.api-ninjas.com/v1/exercises', {
      params: { name: name },
      headers: { 'X-Api-Key': apiKey }
    });
    if (response.data.length === 0) {
      return res.status(404).json({ message: 'No exercises found with that name' });
    }
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error searching for exercise:', error);
    res.status(500).json({ error: 'Error searching for exercise from external API' });
  }
};
