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
router.use('/authenticated', requireAuth);
router.get('/authenticated', getRides);
router.get('/', getAllRides);
router.get('/:id', getRide)
router.post('/authenticated', createRide)
router.delete('/:id', deleteRide)
router.patch('/:id', updateRide)
module.exports = router