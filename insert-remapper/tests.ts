///<reference path="typings/tsd.d.ts" />

interface qUnitTestRunner {
    run: (files: any, callback?: ()=> void) => void;
}

import fs = require('fs');
import insertRemapper = require('index');
var testrunner : qUnitTestRunner = require('qunit');

var testsComplete = function () {
    console.log('Tests completed...');
}

console.log('Tests beginning...');

testrunner.run({
    code: "index.js",
    tests: "index-tests.js"
}, testsComplete);

