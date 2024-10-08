const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Api keys config
const connectDB = require('./Config/dbConfig');
const { cloudinary, checkCloudinaryConfig } = require('./Config/cloudinaryConfig');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const authRoutes = require('./Routes/authRoutes');
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

// Routes
app.use('/auth', authRoutes);
// app.use('/exercise', exerciseRoutes);
// app.use('/workout', workoutRoutes);
app.use('/cloudinary', cloudinaryRoutes);

// Sets port to localhost 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});



 