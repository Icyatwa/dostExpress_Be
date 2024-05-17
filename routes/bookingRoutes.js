// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/bookingController');
// router.post('/', bookingController.createBooking);
// router.get('/bookings/:postId', bookingController.getBookingsByPostId);
// module.exports = router;

// rideBookingRoutes.js
const express = require('express');
const router = express.Router();
const rideBookingController = require('../controllers/bookingController');

router.post('/', rideBookingController.bookRide);

module.exports = router;
