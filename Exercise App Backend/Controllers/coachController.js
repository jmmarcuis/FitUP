const Coach = require('../Models/CoachModel');
const Collaboration = require ('../Models/CollaborationModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../Config/cloudinaryConfig'); 

// Register a new coach
exports.registerCoach = async (req, res) => {
    try {
      const { firstName, lastName, email, coachDescription, coachSpecialization, password } = req.body;
      
      // Check if coach already exists
      const existingCoach = await Coach.findOne({ email });
      if (existingCoach) {
        return res.status(400).json({ message: 'Coach already exists' });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      let profilePictureUrl = 'https://res.cloudinary.com/drf4qnjow/image/upload/v1728341592/profile_pictures/placeholder.jpg';
  
      // If a profile picture was uploaded, send it to Cloudinary
      if (req.files && req.files.profilePicture) {
        const file = req.files.profilePicture;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'profile_pictures',
          width: 300,
          crop: "scale"
        });
        profilePictureUrl = result.secure_url;
      }
  
      // Create new coach
      const newCoach = new Coach({
        firstName,
        lastName,
        email,
        coachDescription,
        coachSpecialization,
        password: hashedPassword,
        profilePicture: profilePictureUrl
      });
  
      // Save coach to database
      await newCoach.save();
  
      res.status(201).json({ message: 'Coach registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
// Login coach
exports.loginCoach = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if coach exists
    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, coach.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create and send token
    const token = jwt.sign(
      {
        id: coach._id,  // Changed from *id to _id
        email: coach.email,
        role: 'coach'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, coachId: coach._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get coach profile
exports.getCoachInfo = async (req, res) => {
  try {
    // The user ID is available from the decoded token
    const coachId = req.user.id;

    // Find the coach by ID, excluding the password field
    const coach = await Coach.findById(coachId).select('-password');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Return the coach information
    res.status(200).json({
      message: 'Coach information retrieved successfully',
      coach: {
        id: coach._id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        coachDescription: coach.coachDescription,
        coachSpecialization: coach.coachSpecialization,
        profilePicture: coach.profilePicture,
        // Add any other fields you want to include
      }
    });
  } catch (error) {
    console.error('Error fetching coach information:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Get All Coaches
exports.getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find({}, '-password');
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coaches', error: error.message });
  }
};

