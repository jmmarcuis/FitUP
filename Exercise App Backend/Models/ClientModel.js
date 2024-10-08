const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  profilePicture: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },
  height: { type: Number }, // Stored in cm
  weight: { type: Number }, // Stored in kg
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  clientImage: { type: String, default: 'https://res.cloudinary.com/drf4qnjow/image/upload/v1728341592/profile_pictures/placeholder.jpg'}  
});

// Hash the password before saving the user model
ClientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // Compare password for login
  ClientSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  // Calculate the user's age
  ClientSchema.methods.getAge = function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  

module.exports = mongoose.model('Client', ClientSchema);