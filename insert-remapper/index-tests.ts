///<reference path="typings/tsd.d.ts" />
///<reference path="index.d.ts" />

QUnit.module("index-tests");

declare var InsertRemapper: InsertRemapper;

test("Can create the InsertRemapper", 1, function () {
    var remapper = new InsertRemapper("", "", "", "");
    ok(true, "pass if no crash");
});



