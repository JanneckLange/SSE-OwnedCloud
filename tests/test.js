const testFilesToRun = [
    './controllerTests/test-auth.js'
];

testFilesToRun.forEach(function (path) {
    require(path)();
});
