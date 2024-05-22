require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const userRoutes = require('./routes/user')
const busRoutes = require('./routes/bus')
const rideRoutes = require('./routes/ride')
const busDetailsRoutes = require('./routes/busDetails');
const bookingRoutes = require('./routes/bookingRoutes');

// express app
const app = express()

// middleware
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/taximan', userRoutes)
app.use('/api/cabs', busRoutes)
app.use('/api/taxis', rideRoutes)
app.use('/api/cabdetails', busDetailsRoutes)
app.use('/api/cabbookings', bookingRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })