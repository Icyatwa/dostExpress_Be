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
      driverName,
      licensePlates,
      location,
      destination,
      time,
      pickup,
      dropoff,
      seats,
      price
    } = req.body

  let emptyFields = []

  if(!driverName) {
    emptyFields.push('driverName')
  }

  if(!licensePlates) {
    emptyFields.push('licensePlates')
  }

  if(!location) {
    emptyFields.push('location')
  }

  if(!destination) {
    emptyFields.push('destination')
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
          driverName,
          licensePlates,
          location,
          destination,
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


module.exports = {
  getRides,
  getAllRides,
  getRide,
  createRide,
  deleteRide,
  updateRide
}