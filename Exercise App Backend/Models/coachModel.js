const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coachDescription: { type: String, required: true },
  coachSpecialization: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Coach", UserSchema);
