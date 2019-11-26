const testFilesToRun = [
    './controllerTests/test-auth.js'
];
const mongoose = require('mongoose');

const config = require('./../config/common');
const db = require('./shared/database-operations');


describe('Test', function () {

    describe('Controller', function () {
        testFilesToRun.forEach(function (path) {
            require(path)();
        });
    });

    before(async function () {
        this.timeout(5000);
        await configureDatabase();
        await db.clearDatabase
    });

    after(function () {
        mongoose.disconnect();
    });
});


function configureDatabase() {
    return new Promise((res, rej) => {
        mongoose.connect(config.database_test, {useNewUrlParser: true,useUnifiedTopology: true});
        mongoose.set("useCreateIndex", true);
        let db = mongoose.connection;

        // Bind connection to error event (to get notification of connection errors)
        db.on('error', ()=>{
            rej()
        });
        db.once('open',()=>{
            console.log('Mongo connected...');
            res()
        });
    });

}


