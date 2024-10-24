const express = require("express");
const router = express.Router();
const coachController = require("../Controllers/coachController");
const { verifyToken } = require('../Middleware/authMiddleware');

router.post("/register", coachController.registerCoach);
router.post("/login", coachController.loginCoach);
router.get('/coach-info', verifyToken, coachController.getCoachInfo);
router.get('/get-coach',verifyToken, coachController.getAllCoaches);

module.exports = router;
