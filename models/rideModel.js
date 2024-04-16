const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rideSchema = new Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
  },
  licensePlates: { type: String, required: true },
  driverName: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  destination: { type: String, required: true },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  seats: { type: String, required: true },
  price: { type: String, required: true },

  user_id: {
    type: String,
    required: true
  },
  
  // status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Ride', rideSchema)