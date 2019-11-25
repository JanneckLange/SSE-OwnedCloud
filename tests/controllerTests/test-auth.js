const authController = require('../../controllers/authController');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;
chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('AuthController', function () {
        describe('registration', function () {
            it('should create a new user', (done) => {
               expect(authController.registerUser("test@mail.de","1234","Max")).to.have.status(200);

            });
        });
    });
};
