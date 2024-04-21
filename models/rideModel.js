const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rideSchema = new Schema({
  bus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
  stations: [{ type: String, required: true }],
  time: { type: String },
  price: { type: Number },
  user_id: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
