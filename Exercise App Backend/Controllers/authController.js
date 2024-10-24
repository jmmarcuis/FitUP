const Client = require("../Models/ClientModel");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../Utilities/emailUtilities");
const bcrypt = require("bcryptjs");
const axios = require("axios");  

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      height,
      weight,
      gender,
      captchaToken
    } = req.body;

    // CAPTCHA verification
    if (!captchaToken) {
      return res.status(400).json({ message: "CAPTCHA is required" });
    }

    // Verify CAPTCHA using Google reCAPTCHA API
    const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    
    const captchaResponse = await axios.post(captchaVerificationUrl);
    
    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    // Input validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email already in use" });
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
      gender,
      clientImage:
        "https://res.cloudinary.com/drf4qnjow/image/upload/v1728341592/profile_pictures/placeholder.jpg",
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
      message:
        "Registration successful. Please check your email for the OTP to verify your account.",
      clientId: client._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error registering new client. Please try again later.",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const client = await Client.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!client) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    client.isVerified = true;
    client.otp = undefined;
    client.otpExpires = undefined;
    await client.save();

    // Generate JWT token after successful verification
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Email verified successfully",
      token,
      client: {
        id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying email. Please try again later." });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the unverified client
    const client = await Client.findOne({ email, isVerified: false });

    if (!client) {
      return res
        .status(404)
        .json({ message: "Unverified registration not found" });
    }

    // Delete the unverified registration
    await Client.deleteOne({ _id: client._id });

    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Cancel registration error:", error);
    res.status(500).json({
      message: "Error cancelling registration. Please try again later.",
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (client.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const otp = generateOTP();
    client.otp = otp;
    client.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await client.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("OTP resend error:", error);
    res
      .status(500)
      .json({ message: "Error resending OTP. Please try again later." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Find the client
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Check if email is verified
    if (!client.isVerified) {
      return res.status(403).json({
        message:
          "Email not verified. Please verify your email before logging in.",
      });
    }
    // Check password
    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: client._id, email: client.email, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      client: {
        id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        profilePicture: client.profilePicture,
        // Add any other relevant client information you want to send
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Error logging in. Please try again later." });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // Check if the token is provided
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the client associated with the token
    const client = await Client.findById(decoded.id).select('-password');

    // Check if the client exists
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Respond with success and client information
    res.status(200).json({ message: 'Token is valid', client });
  } catch (error) {
    console.error('Token verification error:', error);

    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Handle other errors
    res.status(500).json({ message: 'Error verifying token' });
  }
};
