const express = require('express');
const http = require('http'); // Import the http module
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io'); // Import Socket.IO

// Middleware
const { verifyToken, verifySocketToken } = require('./Middleware/authMiddleware');


// Api keys config
const connectDB = require('./Config/dbConfig');
const { cloudinary, checkCloudinaryConfig } = require('./Config/cloudinaryConfig');
const exerciseRoutes = require('./Routes/exerciseRoutes');
const authRoutes = require('./Routes/authRoutes');
const clientRoutes = require('./Routes/clientRoutes');
const coachRoutes = require('./Routes/coachRoutes');
const messageRoutes = require('./Routes/messageRoute');
const collaborationRoutes = require('./Routes/collaborationRoutes');
const workoutRoutes = require('./Routes/workoutRoutes');
const cloudinaryRoutes = require('./Routes/cloudinaryRoutes');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});


// Connect to the database
connectDB().then(() => console.log("Backend server connected to MongoDB Atlas"));

// Check for Cloudinary connection
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
app.use ('/collab' , collaborationRoutes);
app.use ('/message' , messageRoutes);

// app.use('/exercise', verifyToken, exerciseRoutes);
// app.use('/workout', verifyToken, workoutRoutes);

// Public routes
app.use('/auth', authRoutes);
app.use('/cloudinary', cloudinaryRoutes);

// Socket.IO Middleware for Authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const user = await verifySocketToken(token); 
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user._id}`);

  socket.on('joinCollaboration', (collaborationId) => {
    socket.join(collaborationId);
    console.log(`User ${socket.user._id} joined collaboration ${collaborationId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user._id}`);
  });
});

// Make io accessible in routes/controllers
app.set('io', io);

// Sets port to localhost 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



