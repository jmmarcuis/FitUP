const jwt = require('jsonwebtoken');
const Client = require('../Models/ClientModel'); 
const Coach = require('../Models/coachModel'); 

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token);
 
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};


const isCoach = (req, res, next) => {
  console.log('isCoach middleware - req.user:', req.user);
  if (req.user && req.user.role === 'coach') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Coach role required.' });
  }
};

async function verifySocketToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("GENE", decoded);
    const client = await Client.findById(decoded.id);
    console.log("THIS IS THE CLIENT: ", client);
    if (client) return client;

    const coach = await Coach.findById(decoded.id);
    console.log("THIS IS THE COACH: ", coach);
    if (coach) return coach;

    throw new Error("User not found");
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new Error("Invalid token");
  }
}
module.exports = { verifyToken, isCoach, verifySocketToken};