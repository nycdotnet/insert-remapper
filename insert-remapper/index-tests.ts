///<reference path="typings/tsd.d.ts" />

QUnit.module("index-tests");

import InsertRemapper = require("index");


test("Can create the insertRemapper", 1, function () {
    var remapper = new InsertRemapper("", "", "", "");
    ok(true, "a dummy");
});



