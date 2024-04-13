const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    // required: true,
    unique: true
  },
  password: {
    type: String,
    // required: true
  },
  accessCode: {
    type: String,
    required: true
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
