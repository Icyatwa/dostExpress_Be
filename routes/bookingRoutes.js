// rideBookingRoutes.js
const express = require('express');
const router = express.Router();
const rideBookingController = require('../controllers/bookingController');

router.post('/', rideBookingController.bookRide);

module.exports = router;
