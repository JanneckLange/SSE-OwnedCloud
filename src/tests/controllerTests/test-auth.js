const authController = require('../../controllers/authController');
const userModel = require('../../models/userModel').user;
const userData = require('../shared/userData');
const jwt = require('jsonwebtoken');
const config = require('./../../config/common');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('AuthController', function () {
        describe('registration', function () {
            it('expect to create a new user', (done) => {
                authController.registerPlayer(userData.user.email, userData.user.password, userData.user.username).then(() => {
                    userModel.findOne({email: userData.user.email}).then(user => {

                        expect(user).to.be.an('object');

                        expect(user).to.have.property('email')
                            .which.is.a('string')
                            .to.be.equal(userData.user.email);

                        expect(user).to.have.property('name')
                            .which.is.a('string')
                            .to.be.equal(userData.user.username);

                        expect(user).to.have.property('password')
                            .which.is.a('string')
                            .to.be.equal(userData.user.password);

                        done();
                    });
                });
            });

            it('expect to fail (user already exist)', (done) => {
                //todo
            });
        });

        describe('login', function () {
            it('expect to return a valid token', (done) => {
                authController.loginPlayer(userData.user.email, userData.user.password).then(token => {

                    expect(token).to.be.a('string');

                    jwt.verify(token, config.salt, (error, decoded) => {

                        expect(decoded).to.be.a('object');

                        expect(decoded).to.have.property('userEmail')
                            .which.is.a('string')
                            .to.be.equal(userData.user.email);

                        done();
                    });
                });
            });

            it('expect to fail (wrong email)', (done) => {
                authController.loginPlayer(userData.wrong_data.email[0], userData.user.password).then(token => {
                    expect(token).to.be.a('Error');
                    done();
                });
            });

            it('expect to fail (wrong password)', (done) => {
                //todo
            });
        });
    });
};
