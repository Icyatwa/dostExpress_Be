// const Booking = require('../models/bookingModel');
// const Ride = require('../models/rideModel');
// const mongoose = require('mongoose');

// exports.createBooking = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { rideId, passenger, selectedPassengers } = req.body;

//     // Validate input data
//     if (!rideId || !passenger || selectedPassengers <= 0) {
//       throw new Error('Invalid input data');
//     }

//     // Fetch the ride corresponding to the rideId
//     const ride = await Ride.findById(rideId).session(session);
//     if (!ride) {
//       throw new Error('Ride not found');
//     }

//     // Calculate total passengers already booked for this ride
//     const existingBookings = await Booking.find({ rideId }).session(session);
//     const totalPassengers = existingBookings.reduce((acc, booking) => acc + booking.selectedPassengers, 0);

//     // Check if there are available seats for the entire journey segment
//     if (totalPassengers + selectedPassengers > ride.bus.capacity) {
//       throw new Error('Seats are full for this ride segment');
//     }

//     // Create the booking
//     const newBooking = new Booking({
//       rideId,
//       passenger,
//       selectedPassengers,
//     });

//     // Save the booking
//     await newBooking.save({ session });

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json(newBooking);
//   } catch (error) {
//     // Rollback the transaction in case of error
//     await session.abortTransaction();
//     session.endSession();

//     console.error('Booking Error:', error);
//     res.status(400).json({ error: error.message });
//   }
// };


// exports.getBookingsByPostId = async (req, res) => {
//   const postId = req.params.postId;
//   try {
//     const bookings = await Booking.find({ rideId: postId });
//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



// rideBookingController.js
const RideBooking = require('../models/bookingModel');
const BusDetails = require('../models/busDetailsModel');
const Ride = require('../models/rideModel')

const bookRide = async (req, res) => {
  const { ride_id, seatsBooked } = req.body;
  try {
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const booking = await RideBooking.create({
      ride: ride_id,
      seatsBooked
    });

    const updatedBusDetails = await BusDetails.findOneAndUpdate(
      { rideGroupId: ride.rideGroupId },
      { $inc: { busCapacity: -seatsBooked } },
      { new: true }
    );

    res.status(201).json({ booking, updatedBusDetails });
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { bookRide };