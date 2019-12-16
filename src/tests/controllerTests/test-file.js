const fileModel = require('../../models/fileModel').file;
const userModel = require('../../models/userModel').user;
const authController = require('../../controllers/authController');
const fileController = require('../../controllers/fileController');
const testData = require('../shared/userData');


const chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {
    describe('FileController', function () {

        describe('upload', function () {

            it('should upload a file', (done) => {

                userModel.findOne({email: testData.user.email}).then(user => {
                    fileController.uploadFile(user.id, testData.file[0].content, testData.file[0].name).then(() => {

                        fileModel.findOne({content: testData.file[0].content}).then(file => {
                            expect(file).to.be.an('object');

                            expect(file).to.have.property('owner')
                                .which.is.a('string')//todo not a string
                                .to.be.equal(user.id);

                            expect(file).to.have.property('fileName')
                                .which.is.a('string')
                                .to.be.equal(testData.file[0].name);

                            expect(file).to.have.property('content')
                                .which.is.a('string')
                                .to.be.equal(testData.file[0].content);

                            expect(file).to.have.property('isPublic')
                                .which.is.a('boolean')
                                .to.be.equal(false);

                            expect(file).to.have.property('publicLink')
                                .which.is.a('string');

                            userModel.findById(user.id).then(user => {
                                expect(user).to.be.an('object');

                                expect(user).to.have.property('uploadedFiles');

                                let fileNames = user.uploadedFiles.map(a => a.fileName);

                                fileNames.should.include(testData.file[0].name);

                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('download', function (userID, fileID) {
            it('should download a file', (done) => {
                fileController.getFile().then((file) => {
//todo
                });
            });
        });

        describe('list files', function (userID) {
            it('should list all files', (done) => {
                fileController.listFiles().then((ids) => {
//todo
                });
            });
        });


    });
};
