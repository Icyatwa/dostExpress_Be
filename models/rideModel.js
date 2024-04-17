const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rideSchema = new Schema({

  licensePlates: {
    type: String,
  },

  driverName: {
    type: String,
  },

  location: {
    type: String,
  },

  destination: {
    type: String,
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