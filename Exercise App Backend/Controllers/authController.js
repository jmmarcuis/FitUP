 
const Client = require ('../Models/ClientModel')
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail } = require('../Utilities/emailUtilities');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      dateOfBirth, 
      height, 
      weight 
    } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new client
    const client = new Client({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      height,
      weight,
      clientImage: 'https://res.cloudinary.com/drf4qnjow/image/upload/v1728341592/profile_pictures/placeholder.jpg'  
    });

    // Generate and set OTP
    const otp = generateOTP();
    client.otp = otp;
    client.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save the client
    await client.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({ 
      message: 'Registration successful. Please check your email for the OTP to verify your account.',
      clientId: client._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering new client. Please try again later.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the client
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!client.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email before logging in.' });
    }

    // Check password
    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      client: {
        id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        userName: client.userName,
        email: client.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const client = await Client.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!client) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    client.isVerified = true;
    client.otp = undefined;
    client.otpExpires = undefined;
    await client.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email. Please try again later.' });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const otp = generateOTP();
    client.otp = otp;
    client.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await client.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.error('OTP resend error:', error);
    res.status(500).json({ message: 'Error resending OTP. Please try again later.' });
  }
};