const express = require('express')
const {
  fetchRides
} = require('../controllers/rideController')

const app = express();


// GET all rides
app.get('/', fetchRides)

module.exports = app