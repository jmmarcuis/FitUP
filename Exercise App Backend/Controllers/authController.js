const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
exports.register = async (req, res) => {
  const { userName, firstName, lastName, email, password, dateOfBirth, height, weight } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ userName, firstName, lastName, email, password, dateOfBirth, height, weight });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


// Login
exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ userName: username });
    } else {
      return res.status(400).json({ message: "Please provide email or username" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update Account
exports.update = async (req, res) => {
  // Implement update logic here
  // Example:
  // const { userId } = req.params;
  // const updateData = req.body;
  // try {
  //   const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }
  //   res.json(user);
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send('Server Error');
  // }
};
