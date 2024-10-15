const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/messageController");
const { verifyToken} = require('../Middleware/authMiddleware');


router.post('/messages', verifyToken, messageController.sendMessage);
router.get('/collaborations/:collaborationId/messages', verifyToken, messageController.getMessages);

module.exports = router;
