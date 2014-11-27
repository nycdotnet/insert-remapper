///<reference path="../typings/tsd.d.ts" />

import InsertRemapper = require('../index');

module IndexTestsArtifacts {
    export var banner1js = '//banner 1\n' +
        'var x = 1;\n' +
        'x = x + 1;\n' +
        'console.log("x = " + x);\n' +
        'console.log("all done!");\n' +
        '//# sourceMappingURL=Banner1.js.map';
    export var banner1jsmap = '{"version":3,"file":"Banner1.js","sourceRoot":"","sources":["Banner1.ts"],"names":[],"mappings":"AACA,AADA,UAAU;IACN,CAAC,GAAG,CAAC,CAAC;AAEV,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC;AAEV,OAAO,CAAC,GAAG,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC;AAExB,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC"}';
}

InsertRemapper.externalAPI.readFileSync = (inputFileName: string, encoding: string) => {
    if (inputFileName === "banner1.js" && encoding === "utf8") {
        return IndexTestsArtifacts.banner1js;
    } else if (inputFileName === "banner1.js.map" && encoding === "utf8") {
        return IndexTestsArtifacts.banner1jsmap;
    }
    return "";
}

InsertRemapper.externalAPI.writeFileSync = (outputFileName: string, data: string, encoding: string) => {
    InsertRemapper.externalAPI.writeResults.push({ outfile: outputFileName, data: data, endoding: encoding });
};

module IndexTests {

    QUnit.test("hello test", function (assert) {

        var ir = new InsertRemapper("banner1.js", "banner1.js.map", "\n", "utf8");

        ir.save("out.js", "out.js.map", "ref.js", "override.js");

        console.log(InsertRemapper.externalAPI.writeResults);

        assert.ok(!!ir, "object exists");
    });

}

export = IndexTests;