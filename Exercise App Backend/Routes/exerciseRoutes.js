const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../Middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Fetch exercises by muscle group
router.get('/by-muscle/:muscle', async (req, res) => {
  const muscle = req.params.muscle;
  const apiKey = process.env.API_NINJAS_KEY;
  try {
    const response = await axios.get(`https://api.api-ninjas.com/v1/exercises`, {
      params: { muscle: muscle },
      headers: { 'X-Api-Key': apiKey }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Error fetching exercises from external API' });
  }
});

// Get list of all available muscle groups
router.get('/muscle-groups', (req, res) => {
  const muscleGroups = [
    'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest',
    'forearms', 'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back',
    'neck', 'quadriceps', 'traps', 'triceps'
  ];
  res.status(200).json(muscleGroups);
});

//Search for specific exercise
router.get('/search', async (req, res) => {
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
});


module.exports = router;