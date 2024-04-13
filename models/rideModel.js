const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rideSchema = new Schema({
  userName: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  carModel: {
    type: String,
  },

  licensePlates: {
    type: String,
  },

  carColor: {
    type: String,
  },

  location: {
    type: String,
  },

  destination: {
    type: String,
  },

  day: {
    type: Date,
  },

  time: {
    type: String,
  },

  pickup: {
    type: String,
  },

  dropoff: {
    type: String,
  },

  seats: {
    type: Number,
  },

  price: {
    type: Number,
  },

  user_id: {
    type: String,
    required: true
  },
  
  // status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Ride', rideSchema)