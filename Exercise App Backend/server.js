const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Config/dbConfig');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const authRoutes = require('./Routes/authRoutes');
const workoutRoutes = require('./Routes/workoutRoutes')

const app = express();

// Connect to the database
connectDB().then(() => console.log("Backend server connected to MongoDB Atlas"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes)
app.use('/exercise', exerciseRoutes);
app.use('/workout', workoutRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
