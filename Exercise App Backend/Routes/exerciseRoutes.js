const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

//JOB: COACHES SHOULD ONLY HAVE THIS
// Search for specific exercise
router.get('/search', exerciseController.searchExercise);

 

module.exports = router;