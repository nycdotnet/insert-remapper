/*
 What we need to do:
 Open the generated JS file and JS Map.
 if no JS Map was specified, find it by reading the JS file backward from the end and look for startsWith //# sourceMappingURL=
 Read through the map, identifying the corresponding location from the original source file - cache all of this.
 Then output the new JS file and set up a new map, re-using all of the cached mapping info except this time with extra
  lines added.

*/
var insertRemapper = (function () {
    function insertRemapper(generatedJSFileName, generatedJSMapFileName, lineEnding, encoding) {
        if (lineEnding === void 0) { lineEnding = '\n'; }
        if (encoding === void 0) { encoding = 'utf8'; }
        this.generatedJSFileName = generatedJSFileName;
        this.generatedJSMapFileName = generatedJSMapFileName;
        this.lineEnding = lineEnding;
        this.encoding = encoding;
        this.fs = require('fs');
        this.SourceMap = require('source-map');
        this.generatedJSFileContents = this.fs.readFileSync(generatedJSFileName, this.encoding).split(this.lineEnding);
        this.rawSourceMap = JSON.parse(this.fs.readFileSync(generatedJSMapFileName, this.encoding));
        if (insertRemapper.verboseLoggingToConsole) {
            console.log(JSON.stringify(this.rawSourceMap));
        }
        this.consumeSourceMap();
    }
    insertRemapper.prototype.generatedJSFileLineCount = function () {
        return this.generatedJSFileContents.length;
    };
    insertRemapper.prototype.consumeSourceMap = function () {
        var _this = this;
        var smc = new this.SourceMap.SourceMapConsumer(this.rawSourceMap);
        this.generatedJSFileMappings = [];
        smc.eachMapping(function (mapping) {
            _this.generatedJSFileMappings.push(mapping);
        }, this, smc.GENERATED_ORDER);
        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogMappings();
        }
    };
    insertRemapper.prototype.sourceMappingUrlArrayIndex = function () {
        for (var i = this.generatedJSFileContents.length - 1; i >= 0; i -= 1) {
            //todo: fix to regex
            if (this.generatedJSFileContents[i].indexOf("//#") >= 0 && this.generatedJSFileContents[i].indexOf("sourceMappingURL") >= 0 && this.generatedJSFileContents[i].indexOf("=") >= 0) {
                return i;
            }
        }
        return -1;
    };
    insertRemapper.prototype.save = function (outputJSFileNameAndPath, outputJSMapFileNameAndPath, referencedJSFileNameAndPath, sourceMappingUrlOverride) {
        if (outputJSFileNameAndPath === void 0) { outputJSFileNameAndPath = ""; }
        if (outputJSMapFileNameAndPath === void 0) { outputJSMapFileNameAndPath = ""; }
        if (referencedJSFileNameAndPath === void 0) { referencedJSFileNameAndPath = outputJSFileNameAndPath; }
        if (sourceMappingUrlOverride === void 0) { sourceMappingUrlOverride = ""; }
        if (outputJSFileNameAndPath === "") {
            outputJSFileNameAndPath = this.generatedJSFileName;
        }
        if (outputJSMapFileNameAndPath === "") {
            outputJSMapFileNameAndPath = this.generatedJSMapFileName;
        }
        if (sourceMappingUrlOverride !== "") {
            var sourceMappingUrlLineIndex = this.sourceMappingUrlArrayIndex();
            if (sourceMappingUrlLineIndex > -1) {
                this.generatedJSFileContents[sourceMappingUrlLineIndex] = "//# sourceMappingURL=" + sourceMappingUrlOverride;
            }
        }
        this.fs.writeFile(outputJSFileNameAndPath, this.generatedJSFileContents.join(this.lineEnding), { encoding: this.encoding });
        var smg = new this.SourceMap.SourceMapGenerator({ file: referencedJSFileNameAndPath, sourceRoot: this.rawSourceMap.sourceRoot });
        for (var i = 0; i < this.generatedJSFileMappings.length; i += 1) {
            var mapping = this.generatedJSFileMappings[i];
            smg.addMapping({ generated: { line: mapping.generatedLine, column: mapping.generatedColumn }, original: { line: mapping.originalLine, column: mapping.originalColumn }, source: mapping.source, name: mapping.name });
        }
        this.fs.writeFile(outputJSMapFileNameAndPath, smg.toString(), { encoding: "utf8" /* this encoding is required by the spec */ });
    };
    insertRemapper.prototype.insert = function (codeToInsert, oneBasedGeneratedLineNumber) {
        var linesToInsert = this.toStringArrayOnNewline(codeToInsert);
        this.generatedJSFileContents = this.insertArrayAt(this.generatedJSFileContents, oneBasedGeneratedLineNumber - 1, linesToInsert);
        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogGeneratedFile();
        }
        var insertedLineCount = linesToInsert.length;
        var fileMappingsCount = this.generatedJSFileMappings.length;
        for (var i = 0; i < fileMappingsCount; i += 1) {
            if (this.generatedJSFileMappings[i].generatedLine >= oneBasedGeneratedLineNumber) {
                this.generatedJSFileMappings[i].generatedLine += (insertedLineCount + 1);
            }
        }
        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogMappings();
        }
    };
    insertRemapper.prototype.consoleLogMappings = function () {
        for (var i = 0; i < this.generatedJSFileMappings.length; i += 1) {
            var mapping = this.generatedJSFileMappings[i];
            console.log("gen " + mapping.generatedLine + "," + mapping.generatedColumn + " => orig " + mapping.originalLine + "," + mapping.originalColumn + " " + mapping.name + " (" + mapping.source + ")");
        }
    };
    insertRemapper.prototype.consoleLogGeneratedFile = function () {
        console.log(this.generatedJSFileContents.join(this.lineEnding));
    };
    insertRemapper.prototype.prepend = function (codeToinsert) {
        this.insert(codeToinsert, 1);
    };
    insertRemapper.prototype.append = function (codeToinsert) {
        this.insert(codeToinsert, this.generatedJSFileLineCount() + 1);
    };
    insertRemapper.prototype.toStringArrayOnNewline = function (theString) {
        if ("" + theString === "") {
            return [];
        }
        else if (theString.indexOf(this.lineEnding) === -1) {
            return [theString];
        }
        return theString.split(this.lineEnding);
    };
    insertRemapper.prototype.insertArrayAt = function (array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    };
    insertRemapper.verboseLoggingToConsole = false;
    return insertRemapper;
})();
var generatedJSFileName = './Artifacts/Banner10.js';
var modifiedJSFileName = './Artifacts/Banner10modified.js';
insertRemapper.verboseLoggingToConsole = true;
var ir = new insertRemapper(generatedJSFileName, generatedJSFileName + '.map', '\r\n', 'utf8');
ir.insert("//test1\n//test2", 12);
ir.save(modifiedJSFileName, modifiedJSFileName + '.map', 'Banner10Modified.js', 'Banner10Modified.js.map');
//# sourceMappingURL=app.js.map