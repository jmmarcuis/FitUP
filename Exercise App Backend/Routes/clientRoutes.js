const express = require('express');
const router = express.Router();
const { getClientDetails } = require('../Controllers/clientController');

 router.get('/details', getClientDetails);

module.exports = router;