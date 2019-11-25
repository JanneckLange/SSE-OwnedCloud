const testFilesToRun = [
    './controllerTests/test-auth.js'
];

describe('Backend test suite', () => {
    testFilesToRun.forEach(function (path) {
        let test = require(path);
        test();
    });
});
