const express = require("express");
const router = express.Router();
const collaborationController = require("../Controllers/collaborationController");

const { verifyToken, isCoach} = require('../Middleware/authMiddleware');

router.post('/collaborations', verifyToken, collaborationController.requestCollaboration);
router.put('/collaborations/:id/respond', verifyToken, isCoach, collaborationController.respondToCollaboration);
router.get('/collaborations/pending', verifyToken, isCoach, collaborationController.getPendingRequests);
router.post('/collaborations/:id/finish', verifyToken, isCoach, collaborationController.finishCollaboration);
router.get('/coach/active-clients', verifyToken, isCoach, collaborationController.getActiveClients);

router.get('/client/assigned-coach' , verifyToken, collaborationController.getAssignedCoach)
router.get('/client/active-coach', verifyToken, collaborationController.getCollaborationByClient);

router.get('/coach/active-clients-count', verifyToken, isCoach, collaborationController.getActiveClientsCount);
router.get('/coach/pending-clients-count', verifyToken, isCoach, collaborationController.getPendingRequestsCount);
router.get('/coach/clients-counts', verifyToken, isCoach, collaborationController.getClientCounts);

module.exports = router;
