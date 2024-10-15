const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Middleware
const { verifyToken } = require('./Middleware/authMiddleware');

// Api keys config
const connectDB = require('./Config/dbConfig');
const { cloudinary, checkCloudinaryConfig } = require('./Config/cloudinaryConfig');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const authRoutes = require('./Routes/authRoutes');
const clientRoutes = require('./Routes/clientRoutes')
const coachRoutes = require('./Routes/coachRoutes')
const messageRoutes = require('./Routes/messageRoute')
const collaboartionRoutes = require('./Routes/collaborationRoutes')
const workoutRoutes = require('./Routes/workoutRoutes');
const cloudinaryRoutes = require('./Routes/cloudinaryRoutes');
const app = express();

// Connect to the database
connectDB().then(() => console.log("Backend server connected to MongoDB Atlas"));

// Check for cloudinary connection
checkCloudinaryConfig();
const fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Middleware
app.use(cors());
app.use(express.json());


// Apply verifyToken middleware only to routes that require authentication
app.use('/client', verifyToken, clientRoutes);
app.use ('/coach' , coachRoutes);
app.use ('/collab' , collaboartionRoutes);
app.use ('/message' , messageRoutes);

// app.use('/exercise', verifyToken, exerciseRoutes);
// app.use('/workout', verifyToken, workoutRoutes);

// Public routes
app.use('/auth', authRoutes);
app.use('/cloudinary', cloudinaryRoutes);

// Sets port to localhost 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
