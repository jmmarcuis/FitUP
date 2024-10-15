const express = require("express");
const router = express.Router();
const collaborationController = require("../Controllers/collaborationController");

const { verifyToken, isCoach} = require('../Middleware/authMiddleware');

router.post('/collaborations', verifyToken, collaborationController.requestCollaboration);
router.put('/collaborations/:id/respond', verifyToken, isCoach, collaborationController.respondToCollaboration);
router.get('/collaborations/pending', verifyToken, isCoach, collaborationController.getPendingRequests);
router.post('/collaborations/:id/finish', verifyToken, isCoach, collaborationController.finishCollaboration);
router.get('/coach/active-clients', verifyToken, isCoach, collaborationController.getActiveClients);
module.exports = router;
