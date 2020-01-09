const userModel = require('../models/userModel').user;
const jwt = require('jsonwebtoken');
const SALT = require('../config/common').salt;

async function registerUser(email, password, name) {
  let user = await userModel
    .findOne({ email: email })
    .lean()
    .exec();
  if (user) {
    throw new Error('User with given email already exists.');
  }

  let newUser = new userModel({
    email,
    password,
    name,
  });
  await newUser.save();
}

async function loginUser(email, password) {
  if (!email) {
    throw new Error('User name missing.');
  } else if (!password) {
    throw new Error('Password missing.');
  }

  let searchCriteria = { email };
  let user = await userModel
    .findOne(searchCriteria)
    .lean()
    .exec();
  if (!user || user.password !== password) {
    throw new Error('Credentials incorrect');
  } else {
    const payload = {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
    };
    // TODO: Change salt
    return jwt.sign(payload, SALT);
  }
}

module.exports = {
  registerUser,
  loginUser,
};
