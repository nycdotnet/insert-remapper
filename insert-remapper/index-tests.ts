///<reference path="typings/tsd.d.ts" />

QUnit.module("index-tests");

import InsertRemapper = require("index"); ///ts:doNotImport 

test("Can create the InsertRemapper", 1, function () {
    var remapper = new InsertRemapper("", "", "", "");
    ok(true, "pass if no crash");
});



