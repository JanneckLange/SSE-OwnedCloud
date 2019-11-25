const authController = require('../../controllers/authController');
const userModel = require('../../models/userModel');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('AuthController', function () {
        describe('registration', function () {
            it('should create a new user', (done) => {
                const email = "test@mail.de";
                authController.registerUser(email,"1234","Max").then(()=>{
                    userModel.findOne({email: email}).lean().exec().then(user=>{
                        expect(user).to.be.true;
                    });
                });
            });
        });
    });
};
