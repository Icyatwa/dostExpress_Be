// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
// const rideSchema = new Schema({
//   bus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
//   stations: [{ type: String, required: true }],
//   time: { type: String },
//   price: { type: Number },
//   user_id: { type: String, required: true },
//   publishSchedule: [{
//     dayOfWeek: { type: Number, required: true }, // 0 for Sunday, 1 for Monday, and so on
//     hour: { type: Number, required: true }, // Hour of the day (0-23)
//     minute: { type: Number, required: true } // Minute of the hour (0-59)
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('Ride', rideSchema);

const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true},
  stations: { type: [String], required: true },
  time: { type: String },
  price: { type: Number },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishSchedule: { type: [Object] },
  rideGroupId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookedSeats: { type: Map, of: Number, default: {} }
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;

