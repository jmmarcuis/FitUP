const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollaborationSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  coach: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'active', 'completed'], default: 'pending' },
  notes: { type: String },
});

module.exports = mongoose.model("Collaboration", CollaborationSchema);