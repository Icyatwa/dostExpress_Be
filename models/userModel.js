const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  accessCode: {
    type: String,
    required: true
  }
});

userSchema.statics.signup = async function(email, password, companyName, accessCode) {
  if (!email || !password || !companyName || !accessCode) {
    throw new Error('All fields must be filled');
  }
  
  // Simple access code validation
  const validAccessCodes = ['MVC2024', 'YGCB2024', 'EABT2024', 'RHXP2024', 'KCTT2024', 'MTDX2024', 'INEX2024', 'VRGX2024', 'VLCX2024', 'HRZX2024', 'STEX2024', 'KVBT2024', 'RTCX2024', 'DIFX2024', 'STAX2024', 'SLTX2024', 'FDTY2024', 'YCEX2024', 'ALPX2024'];
  if (!validAccessCodes.includes(accessCode)) {
    throw new Error('Invalid access code');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash, companyName, accessCode });
  return user;
};

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw new Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
