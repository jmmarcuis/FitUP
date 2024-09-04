const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  exercises: [{
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: [{
      reps: { type: Number, required: true, min: 1 },
      weight: { type: Number, required: true, min: 0 },
      completed: { type: Boolean, default: false },
      rpe: { type: Number, required: true, min: 1, max: 10 }
    }]
  }]
});

module.exports = mongoose.model('Workout', WorkoutSchema);
