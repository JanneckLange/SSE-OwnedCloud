const userModel = require('../models/userModel').user;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/common');

async function registerUser(email, password, name) {
  // recreate email hash
  email = hash(email);

  let user = await userModel
    .findOne({ email: email })
    .lean()
    .exec();
  if (user) {
    throw new Error('User with given email already exists.');
  }

  password = hash(password);

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
  // recreate hashes
  email = hash(email);
  password = hash(password);

  let user = await userModel
    .findOne({ email })
    .lean()
    .exec();

  if (!user || user.password !== password) {
    throw new Error('Credentials incorrect');
  } else {
    const payload = {
      userId: user._id,
      userName: user.name,
      userRole: user.role,
    };
    return jwt.sign(payload, config.salt_jwt, { expiresIn: config.TOKEN_EXPIRY_SECONDS });
  }
}

function hash(thing) {
  return crypto
    .pbkdf2Sync(thing, config.salt_user, 100000, 64, 'sha512')
    .toString('base64');
}

module.exports = {
  registerUser,
  loginUser,
};
