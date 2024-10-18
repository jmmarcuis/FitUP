// Routes/exerciseRoutes.js
const express = require('express');
const { searchExercises,getExerciseDetails} = require('../Controllers/exerciseController');

const router = express.Router();

// Route to search exercises with the search term and optional language
router.get('/search', searchExercises);
router.get('/:id', getExerciseDetails);
module.exports = router;
