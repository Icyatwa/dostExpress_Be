const Ride = require('../models/rideModel')
const mongoose = require('mongoose')


// get all Rides
const getRides = async (req, res) => {
  const user_id = req.user._id

  const rides = await Ride.find({user_id})
    .sort({createdAt: -1})

  res.status(200).json(rides)
}

// Get all rides for unauthenticated users
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get a single ride
const getRide = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such ride'})
  }

  const ride = await Ride.findById(id)

  if (!ride) {
    return res.status(404).json({error: 'No such ride'})
  }
  
  res.status(200).json(ride)
}


// create new ride
const createRide = async (req, res) => {
  const
    {
      userName,
      phoneNumber,
      carModel,
      licensePlates,
      carColor,
      location,
      destination,
      day,
      time,
      pickup,
      dropoff,
      seats,
      price
    } = req.body

  let emptyFields = []

  if(!userName) {
    emptyFields.push('userName')
  }

  if(!phoneNumber) {
    emptyFields.push('phoneNumber')
  }

  if(!carModel) {
    emptyFields.push('carModel')
  }

  if(!licensePlates) {
    emptyFields.push('licensePlates')
  }

  if(!carColor) {
    emptyFields.push('carColor')
  }

  if(!location) {
    emptyFields.push('location')
  }

  if(!destination) {
    emptyFields.push('destination')
  }

  if(!day) {
    emptyFields.push('day')
  }

  if(!time) {
    emptyFields.push('time')
  }

  if(!pickup) {
    emptyFields.push('pickup')
  }

  if(!dropoff) {
    emptyFields.push('dropoff')
  }

  if(!seats) {
    emptyFields.push('seats')
  }

  if(!price) {
    emptyFields.push('price')
  }

  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const ride = await Ride.create
        ({
            userName,
            phoneNumber,
            carModel,
            licensePlates,
            carColor,
            location,
            destination,
            day,
            time,
            pickup,
            dropoff,
            seats,
            price,
            user_id
        })
    res.status(200).json(ride)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a ride
const deleteRide = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such ride'})
  }

  const ride = await Ride.findOneAndDelete({_id: id})

  if (!ride) {
    return res.status(400).json({error: 'No such ride'})
  }

  res.status(200).json(ride)
}

// update a ride
const updateRide = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such ride'})
  }

  // const ride = await Ride.findOneAndUpdate({_id: id}, {
  //   ...req.body
  // })

  // if (!ride) {
  //   return res.status(400).json({error: 'No such ride'})
  // }

  try {
    // Find the existing ride by ID
    const existingRide = await Ride.findById(id);

    if (!existingRide) {
      return res.status(404).json({ error: 'No such ride' });
    }

    // Update ride properties with new values from the request body
    Object.assign(existingRide, req.body);

    // Save the updated ride to the database
    const updatedRide = await existingRide.save();

    res.status(200).json(updatedRide);
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// const pickRide = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const ride = await Ride.findById(id);

//     if (!ride) {
//       return res.status(404).json({ error: 'No such ride' });
//     }

//     // Update ride status to 'picked'
//     ride.status = 'picked';
//     await ride.save();

//     // Notify the driver (you can use a real-time solution like WebSockets)
//     notifyDriver(ride);

//     res.status(200).json({ message: 'Ride picked successfully' });
//   } catch (error) {
//     console.error('Error picking ride:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Function to notify the driver
// const notifyDriver = (ride) => {
//   // Implement a real-time notification mechanism to notify the driver
//   // You can use WebSockets, Firebase Cloud Messaging (FCM), etc.
//   // For simplicity, let's assume you have a function to send notifications
//   // For example, you can use Socket.io for real-time communication
//   // or send a push notification using FCM.

//   // Example using Socket.io (you need to set up Socket.io in your app)
//   io.to(driverRoomId).emit('ridePicked', { rideId: ride._id, driverId: ride.driverId });
// };



module.exports = {
  getRides,
  getAllRides,
  getRide,
  createRide,
  deleteRide,
  updateRide
}