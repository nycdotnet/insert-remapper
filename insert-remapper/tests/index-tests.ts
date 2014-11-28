///<reference path="../typings/tsd.d.ts" />

import InsertRemapper = require('../index');

module IndexTests {

    module Artifacts {
        export var Banner1js = '//banner 1\n' +
            'var x = 1;\n' +
            'x = x + 1;\n' +
            'console.log("x = " + x);\n' +
            'console.log("all done!");\n' +
            '//# sourceMappingURL=Banner1.js.map';
        export var Banner1jsmap = '{"version":3,"file":"Banner1.js","sourceRoot":"","sources":["Banner1.ts"],"names":[],"mappings":"AACA,AADA,UAAU;IACN,CAAC,GAAG,CAAC,CAAC;AAEV,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;AAEV,OAAO,CAAC,GAAG,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC;AAExB,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC"}';
    }

    class FakeFs {
        public writeResults: { outfile: string; data: string; endoding: string }[] = [];
        public writeFileSync(outputFileName: string, data: string, encoding: string) : void {
            this.writeResults.push({ outfile: outputFileName, data: data, endoding: encoding });
        }
        public readFileSync(inputFileName: string, encoding: string) {
            if (inputFileName === "Banner1.js" && encoding === "utf8") {
                return Artifacts.Banner1js;
            } else if (inputFileName === "Banner1.js.map" && encoding === "utf8") {
                return Artifacts.Banner1jsmap;
            }
            return "";
        }
    }

    QUnit.test("Any tests run", 1, function (assert) {
        assert.ok(true, "tests run.");
    });

    QUnit.test("Can create InsertRemapper instance", 1, function (assert) {
        var ir = new InsertRemapper("Banner1.js", "Banner1.js.map", {lineEnding: "\n", encoding: "utf8", fs: <any>(new FakeFs()) });
        assert.ok(!!ir, "object exists");
    });


    //QUnit.test("If no modifications made, save produces same results as input.", 1, function (assert) {
    //    var ir = new InsertRemapper("Banner1.js", "Banner1.js.map", { lineEnding: "\n", encoding: "utf8", fs: <any>(new FakeFs()) });
    //    ir.save("Banner1.js", "Banner1.js.map", "Banner1.ts", "");

    //    console.log(JSON.stringify((<FakeFs><any>(ir.fs)).writeResults));

    //    assert.ok(!!ir, "object exists");
    //});

}

export = IndexTests;