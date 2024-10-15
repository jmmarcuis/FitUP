const express = require('express');
const router = express.Router();
const { getClientDetails, updateClientDetails, changePassword } = require('../Controllers/clientController');

router.get('/details', getClientDetails);
router.put('/update', updateClientDetails);
router.post('/change-password', changePassword);

module.exports = router;