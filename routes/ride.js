const express = require('express')
const {
  createRide,
  getRides,
  getAllRides,
  getRide,
  deleteRide,
  updateRide
} = require('../controllers/rideController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use('/authenticated', requireAuth);

// GET all rides for authenticated users
router.get('/authenticated', getRides);

// GET all rides for unauthenticated users
router.get('/', getAllRides);

//GET a single ride
router.get('/:id', getRide)

// POST a new ride
router.post('/authenticated', createRide)

// DELETE a ride
router.delete('/:id', deleteRide)

// UPDATE a ride
router.patch('/:id', updateRide)


module.exports = router