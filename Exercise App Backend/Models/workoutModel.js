const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetSchema = new Schema({
  reps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  RPE:{type:Number,default:0}
});

const ExerciseSchema = new Schema({
  exerciseId: { type: String, required: true },
  name: { type: String, required: true },
  sets: [SetSchema]
});

const WorkoutSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  exercises: [ExerciseSchema],
  collaboration: { type: Schema.Types.ObjectId, ref: 'Collaboration', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Coach', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);