const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  muscle: { type: String, required: true },
  equipment: { type: String },
  difficulty: { type: String },
  instructions: { type: String }
});

module.exports = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);