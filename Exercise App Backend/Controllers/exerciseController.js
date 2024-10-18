const axios = require('axios');

// Search for exercises based on a search term
const searchExercises = async (req, res) => {
  try {
    const { term, language } = req.query;
    // Make a request to the wger API search endpoint
    const response = await axios.get('https://wger.de/api/v2/exercise/search/', {

      params: {
        language: language || 'en', // Default to English if language not provided
        term       // Pass the search term from the query
      }
    });
    
    // Filter the suggestions to only include exercises with images
    const filteredSuggestions = response.data.suggestions.filter(
      suggestion => suggestion.data.image && suggestion.data.image_thumbnail
    );

    // Send back the filtered suggestions
    res.json(filteredSuggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search exercises' });
  }
};

const getExerciseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // Make a request to the wger API to get exercise details
    const response = await axios.get(`https://wger.de/api/v2/exerciseinfo/${id}/`);
    
    // Send back the exercise details
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch exercise details' });
  }
};

module.exports = {
  searchExercises,
  getExerciseDetails,
};