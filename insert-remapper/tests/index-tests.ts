///<reference path="../typings/tsd.d.ts" />

import InsertRemapper = require('../index'); //ts:doNotImport

QUnit.test("hello test", function (assert) {

    var ir = new InsertRemapper("", "", "", "");

    assert.ok(!!ir, "object exists");
});

