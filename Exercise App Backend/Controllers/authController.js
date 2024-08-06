const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Fetch user 
exports.fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Register
exports.register = async (req, res) => {
  const { email, password, userName } = req.body;
  
  if (!userName || userName.trim() === '') {
    return res.status(400).json({ message: 'Username is required and cannot be empty' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    user = new User({ email, password, userName });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Complete Profile
exports.completeProfile = async (req, res) => {
  const { firstName, lastName,   dateOfBirth, height, weight } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user profile
    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.height = height;
    user.weight = weight;
    user.isProfileCompleted = true;  // Mark the profile as completed
    
    await user.save();
    res.json({ message: 'Profile completed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
// Login
 
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ message: "Email or username is required" });
  }

  try {
    let user;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ userName: identifier });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Update Account
exports.updateUser = async (req, res) => {
  const { firstName, lastName, email, dateOfBirth, height, weight } = req.body;
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.height = height || user.height;
    user.weight = weight || user.weight;

    await user.save();
    res.json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
