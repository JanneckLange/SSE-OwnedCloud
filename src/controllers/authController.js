const playerModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function registerPlayer(email, password, name) {
    let user = await playerModel.findOne({email: email}).lean().exec();
    if (user) {
        console.log('User with given email already exists.');
        return new Error('User with given email already exists.');
    }
    let payload = {
        email: email,
        password: password,
        name: name
    };

    let newUser = new playerModel(payload);
    await newUser.save().then(user => console.log(JSON.stringify(user))).catch(error => console.log(error));

}

async function loginPlayer(email, password){
    if(!email) {
        return new Error("User name missing.");
    } else if(!password) {
        return new Error("Password missing.");
    }
    let searchCriteria = { email: email };
    let player = playerModel.findOne(searchCriteria).exec();
    return await player.then(processData);

    function processData(user) {
        if(!user) {
            return new Error("User does not exist.");
        } else {
            let passwordCorrect = user.password === password;

            if (!passwordCorrect) {
                return new Error("Wrong password.");
            } else {
                const payload = {
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email
                };
                return jwt.sign(payload, 'SALT');
            }
        }
    }
}

module.exports = {
    registerPlayer,
    loginPlayer
};