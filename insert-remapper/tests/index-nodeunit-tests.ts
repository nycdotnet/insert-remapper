﻿///<reference path="../typings/tsd.d.ts" />

import InsertRemapper = require('../index');
import nodeunit = require('nodeunit');

module IndexTests {

    module Artifacts {
        export var Banner1js = '//banner 1\n' +
            'var x = 1;\n' +
            'x = x + 1;\n' +
            'console.log("x = " + x);\n' +
            'console.log("all done!");\n' +
            '//# sourceMappingURL=Banner1.js.map\n';
        export var Banner1jsmap = '{"version":3,"file":"Banner1.js","sourceRoot":"","sources":["Banner1.ts"],"names":[],"mappings":"AAAA,UAAU;AACV,IAAI,CAAC,GAAG,CAAC;;AAET,CAAC,GAAG,CAAC,GAAG,CAAC;;AAET,OAAO,CAAC,GAAG,CAAC,MAAM,GAAG,CAAC,CAAC;;AAEvB,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC"}';

        export class FakeFs {
            public writeResults: { outfile: string; data: string; endoding: string }[] = [];
            public writeFileSync(outputFileName: string, data: string, encoding: string): void {
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
    }

    exports.testsAreWorking = function (test: nodeunit.Test) {
        test.expect(1);
        test.ok(true, "this assertion should pass");
        test.done();
    };

    exports.canCreateBlankInsertRemapper = function (test: nodeunit.Test) {
        test.expect(1);
        var ir = new InsertRemapper("", "", {});
        test.ok(true, "this assertion should pass");
        test.done();
    };

    exports.saveAfterReadResultsInSameFile= function (test: nodeunit.Test) {
        test.expect(9);

        var fakeFS = new Artifacts.FakeFs();

        var ir = new InsertRemapper("Banner1.js", "Banner1.js.map", { fs: <any>fakeFS });
        ir.save("Banner1.js", "Banner1.js.map", "Banner1.js", "");

        test.strictEqual(fakeFS.writeResults[0].outfile, "Banner1.js", "js output file name is correct");
        test.strictEqual(fakeFS.writeResults[0].data, Artifacts.Banner1js, "js file content is correct");
        test.strictEqual(fakeFS.writeResults[0].endoding, "utf8", "js file encoding is correct");

        var actualMapData = JSON.parse(fakeFS.writeResults[1].data);
        var expectedMapData = JSON.parse(Artifacts.Banner1jsmap);

        test.strictEqual(fakeFS.writeResults[1].outfile, "Banner1.js.map", "js map output file name is correct");
        test.strictEqual(fakeFS.writeResults[1].endoding, "utf8", "js map file encoding is correct");

        test.strictEqual(actualMapData.version, expectedMapData.version, "map data matches");
        test.same(actualMapData.sources, expectedMapData.sources, "map data matches");
        test.same(actualMapData.names, expectedMapData.names, "map data matches");
        test.strictEqual(actualMapData.mappings, expectedMapData.mappings, "map data matches");

        test.done();
    };

}