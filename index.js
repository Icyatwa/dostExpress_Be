require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const userRoutes = require('./routes/user')
const busRoutes = require('./routes/bus')
const rideRoutes = require('./routes/ride')
const busDetailsRoutes = require('./routes/busDetails');

// express app
const app = express()

// middleware
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/rides', rideRoutes)
app.use('/api/details', busDetailsRoutes)

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