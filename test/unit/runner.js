var testrunner = require("qunit");

// or use setup function
testrunner.setup({
    log: {
        summary: true
    }
});


testrunner.run([
    {
        code: "routes/photos.js",
        tests: "test/unit/photos.js"
    }
]);