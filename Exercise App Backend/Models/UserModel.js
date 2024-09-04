const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String, unique: true, sparse: true, default: '' },
  profilePicture: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },
  height: { type: Number }, // Stored in cm
  weight: { type: Number }, // Stored in kg
  created_at: { type: Date, default: Date.now },
  registrationDate: { type: Date, default: Date.now },
  isProfileCompleted: { type: Boolean, default: false },
});

// Middleware to handle conversions before saving
UserSchema.pre('save', function(next) {
  if (this.isModified('heightInInches')) {
    this.height = inchesToCentimeters(this.heightInInches);
  }
  if (this.isModified('weightInPounds')) {
    this.weight = poundsToKilograms(this.weightInPounds);
  }
  next(); 
});

// Hash the password before saving the user model
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate the user's age
UserSchema.methods.getAge = function() {
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

module.exports = mongoose.model('User', UserSchema);
