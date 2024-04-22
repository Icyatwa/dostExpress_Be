const Bus = require('../models/busModel');
const Ride = require('../models/rideModel');
const mongoose = require('mongoose');
const getRides = async (req, res) => {
  const user_id = req.user._id;
  try {
    const rides = await Ride.find({ user_id }).populate('bus').sort({ createdAt: -1 });
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('bus').sort({ createdAt: -1 });
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
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
const createRide = async (req, res) => {
  const {
    stations,
    time,
    price,
    bus_id
  } = req.body;
  let emptyFields = [];
  if (!stations || stations.length < 2) {
    emptyFields.push('stations');
  }
  if (!time) {
    emptyFields.push('time');
  }
  if (!price) {
    emptyFields.push('price');
  }
  if (!bus_id) {
    emptyFields.push('bus_id');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
  }
  try {
    const selectedBus = await Bus.findById(bus_id);
    if (!selectedBus) {
      return res.status(404).json({ error: 'Selected bus not found' });
    }
    const user_id = req.user._id;
    const rides = [];
    const existingRidesFromAB = await Ride.find({ bus: selectedBus, stations: [stations[0], stations[1]] });
    const existingRidesFromBA = await Ride.find({ bus: selectedBus, stations: [stations[1], stations[0]] });
    if (existingRidesFromAB.length >= selectedBus.capacity) {
      return res.status(400).json({ error: 'Seats are full from station A to station B' });
    }
    if (existingRidesFromBA.length >= selectedBus.capacity) {
      return res.status(400).json({ error: 'Seats are full from station B to station A' });
    }
    for (let i = 0; i < stations.length - 1; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        const ride1 = await Ride.create({
          bus: selectedBus,
          stations: [stations[i], stations[j]],
          time,
          price,
          user_id
        });
        rides.push(ride1);
        const ride2 = await Ride.create({
          bus: selectedBus,
          stations: [stations[j], stations[i]],
          time,
          price,
          user_id
        });
        rides.push(ride2);
      }
    }
    res.status(200).json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
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
const updateRide = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such ride'})
  }
  try {
    const existingRide = await Ride.findById(id);
    if (!existingRide) {
      return res.status(404).json({ error: 'No such ride' });
    }
    Object.assign(existingRide, req.body);
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