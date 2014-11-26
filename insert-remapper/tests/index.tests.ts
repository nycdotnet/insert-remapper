/// <reference path="tsunit.ts" />
/// <reference path="../index.ts" />

import InsertRemapper = require('../index');

module Tests {
    export class InsertRemapperTests extends tsUnit.TestClass {
        ableToCreateObject() {
            var x = new InsertRemapper("", "", "", "");
            this.areIdentical(true, true);
        }
    }

    var test = new tsUnit.Test(InsertRemapperTests);

    var result = test.run();

    var outcome = (result.errors.length === 0) ? 'Tests Passed' : 'Tests Failed';

    console.log(outcome);
}