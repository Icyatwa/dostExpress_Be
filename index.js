require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const userRoutes = require('./routes/user')
const busRoutes = require('./routes/bus')
const rideRoutes = require('./routes/ride')

// express app
const app = express()

// middleware
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/ride', rideRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })