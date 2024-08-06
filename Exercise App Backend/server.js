const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Config/dbConfig');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const authRoutes = require('./Routes/authRoutes');
const workoutRoutes = require('./Routes/workoutRoutes');
const cron = require('node-cron');
const cleanupIncompleteRegistrations = require('./Jobs/cleanupIncompleteRegistrations ');

const app = express();

// Connect to the database
connectDB().then(() => console.log("Backend server connected to MongoDB Atlas"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/workout', workoutRoutes);

// Sets port to localhost 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Call the job immediately for debugging purposes
  cleanupIncompleteRegistrations();
});

// Schedule the job to run every 5 minutes
cron.schedule('*/1 * * * *', cleanupIncompleteRegistrations);
