let models = {
  user: require('./../../models/userModel').user,
};

async function clearDatabase() {
  for (let modelKey in models) {
    await models[modelKey].deleteMany().exec();
  }
}

module.exports = {
  clearDatabase: clearDatabase(),
};
