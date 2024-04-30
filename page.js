rideController(const Ride = require('../models/rideModel')
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
      // bus,
      licensePlates,
      driverName,
      location,
      destination,
      time,
      pickup,
      dropoff,
      seats,
      price
    } = req.body

  let emptyFields = []

  if(!licensePlates) {
    emptyFields.push('licensePlates')
  }

  if(!driverName) {
    emptyFields.push('driverName')
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
          // bus,
          licensePlates,
          driverName,
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
})

userController(
    const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
};

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({email, token});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// signup a user
const signupUser = async (req, res) => {
  const {email, password, companyName, accessCode} = req.body;

  try {
    const user = await User.signup(email, password, companyName, accessCode);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({email, token});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = { signupUser, loginUser };

)

requireAuth(
    const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers
 
  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.user = await User.findOne({ _id }).select('_id')
    next()

  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = requireAuth
)


rideModel(
    const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rideSchema = new Schema({
  licensePlates: { type: String, required: true },
  driverName: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  destination: { type: String, required: true },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },

  user_id: {
    type: String,
    required: true
  },
  
  // status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Ride', rideSchema)
)

userModel(
    const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    // required: true,
    // unique: true
  },
  password: {
    type: String,
    // required: true
  },
  accessCode: {
    type: String,
    // required: true
  }
});

// Access codes
const taxiAccessCodes = {
  'Move Cars': 'MVC2024',
  'Yego Cabs': 'YGCB2024'
};

const expressAccessCodes = {
  'East African Bus & Travel Ltd': 'EABT2024',
  'Ruhire Express': 'RHXP2024',
  'Kigali Coach Tour & Travel': 'KCTT2024',
  'Matunda Express': 'MTDX2024',
  'International Express': 'INEX2024',
  'Virunga Express': 'VRGX2024',
  'Volcano Express': 'VLCX2024',
  'Horizon Express': 'HRZX2024',
  'Stella Express': 'STEX2024',
  'Kivu Belt': 'KVBT2024',
  'Ritco Express': 'RTCX2024',
  'Different Express': 'DIFX2024',
  'Star Express': 'STAX2024',
  'Select Express': 'SLTX2024',
  'Fidelity Express': 'FDTY2024',
  'Yahoo Car Express': 'YCEX2024',
  'Alpha Express': 'ALPX2024' 
};

// static signup method
userSchema.statics.signup = async function(email, password, accessCode) {
  // Validation
  if (!email || !password || !accessCode) {
    throw Error('All fields must be filled');
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid');
  }

  // Check if access code is valid
  let validAccessCode = false;
  if (expressAccessCodes[accessCode]) {
    validAccessCode = true;
  } else if (taxiAccessCodes[accessCode]) {
    validAccessCode = true;
  }

  if (!validAccessCode) {
    throw Error('Invalid access code');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, accessCode });

  return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);

)

AuthContext(import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'LOGIN', payload: user }) 
    }
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

})

RideContext(
    import { createContext, useReducer } from 'react'

export const RidesContext = createContext()

export const ridesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RIDES': 
      return {
        ride: action.payload
      }
    case 'CREATE_RIDE':
      return {
        ride: [action.payload, ...state.rides]
      }
    case 'DELETE_RIDE':
      return {
        ride: state.ride.filter((r) => r._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const RidesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ridesReducer, {
    ride: null
  })

  return (
    <RidesContext.Provider value={{...state, dispatch}}>
      { children }
    </RidesContext.Provider>
  )
}
)

useAuthContext(
    import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if(!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}
)

useLogin(
    import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:4000/api/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
)

useLogout(
    import { useAuthContext } from './useAuthContext'
// import { useRidesContext } from './useRidesContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  // const { dispatch: dispatchRides } = useRidesContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    // dispatchRides({ type: 'SET_RIDES', payload: null })
  }

  return { logout }
}
)

useRidesContext(
    import { RidesContext } from '../context/RideContext'
import { useContext } from 'react'

export const useRidesContext = () => {
  const context = useContext(RidesContext)

  if (!context) {
    throw Error('useRidesContext must be used inside an RidesContextProvider')
  }

  return context
}
)

useSignup(
    import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:4000/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
)

Auth(
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState(''); // Add companyName state
    const [accessCode, setAccessCode] = useState(''); // Add accessCode state
    const { signup, error } = useSignup();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Call signup function with companyName and accessCode
      await signup(email, password, companyName, accessCode);
    };
)