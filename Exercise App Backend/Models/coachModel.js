const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const CoachSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String, default: 'https://res.cloudinary.com/drf4qnjow/image/upload/v1728341592/profile_pictures/placeholder.jpg'},
  email: { type: String, required: true, unique: true },
  coachDescription: { type: String, required: true },
  coachSpecialization: { type: String, required: true },
  password: { type: String, required: true },
  collaborations: [{ type: Schema.Types.ObjectId, ref: 'Collaboration' }]
});

module.exports = mongoose.models.Coach || mongoose.model('Coach', CoachSchema);
