const userModel = require('../models/userModel').user;

async function list() {
  return await userModel.find()
}

module.exports = { list }