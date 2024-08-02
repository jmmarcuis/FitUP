const axios = require('axios');

const fetchExercises = async (params) => {
  try {
    const response = await axios.get('https://api.api-ninjas.com/v1/exercises', {
      params: params,
      headers: { 'X-Api-Key': '1LuhSvUUO1AgZbkw04/OnA==2As7FHLM3XpRVG5n' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

module.exports = { fetchExercises };