const userModel = require('../models/userModel').user;
const jwt = require('jsonwebtoken');

async function registerUser(email, password, name) {
    let user = await userModel.findOne({email: email}).lean().exec();
    if (user) {
        return new Error('User with given email already exists.');
    }
    let payload = {
        email: email,
        password: password,
        name: name
    };

    let newUser = new userModel(payload);
    await newUser.save().then(user => console.log(JSON.stringify(user))).catch(error => console.log(error));
}

// TODO: Revisit error handling
async function loginUser(email, password){
    if(!email) {
        return new Error("User name missing.");
    } else if(!password) {
        return new Error("Password missing.");
    }
    let searchCriteria = { email: email };
    let player = userModel.findOne(searchCriteria).exec();
    return await player.then(checkLogin);

    function checkLogin(user) {
        if(!user) {
            return new Error("Credentials incorrect");
        } else {
            let passwordCorrect = user.password === password;

            if (!passwordCorrect) {
                return new Error("Credentials incorrect");
            } else {
                const payload = {
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email
                };
                // TODO: Change salt
                return jwt.sign(payload, 'SALT');
            }
        }
    }
}

module.exports = {
    registerUser,
    loginUser
};
