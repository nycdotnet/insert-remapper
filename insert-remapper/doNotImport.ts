import fs = require('fs');

(function () {

    var scripts: string[] = [];
    var doNotImport = /^(?:\s*)var.+=.+require.+\/\/\/ts:doNotImport(?:\s*)$/;

    for (var i = 2; i < process.argv.length; i += 1) {
        scripts.push(process.argv[i]);
    }

    for (var scriptFileIndex = 0; scriptFileIndex < scripts.length; scriptFileIndex += 1) {
        var scriptFileName = scripts[scriptFileIndex];

        console.log("reading " + scriptFileName);

        var scriptContent = fs.readFileSync(scriptFileName, "utf8").split("\n");

        var foundChange = false;

        for (var lineIndex = 0; lineIndex < scriptContent.length; lineIndex += 1) {
            if (scriptContent[lineIndex].match(doNotImport)) {
                foundChange = true;
                console.log("modifying " + scriptFileName);
                scriptContent[lineIndex] = "";
            }
        }

        if (foundChange) {
            console.log("saving " + scriptFileName);
            fs.writeFile(scriptFileName, scriptContent.join("\n"), { encoding: "utf8" });
        }
    }
})();