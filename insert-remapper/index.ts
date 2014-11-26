/*
 What we need to do:
 Open the generated JS file and JS Map.
 if no JS Map was specified, find it by reading the JS file backward from the end and look for startsWith //# sourceMappingURL=
 Read through the map, identifying the corresponding location from the original source file - cache all of this.
 Then output the new JS file and set up a new map, re-using all of the cached mapping info except this time with extra
  lines added.

*/

interface SourceMapPosition {
    line: number;
    column: number;
}

interface SourceMapInfo extends SourceMapPosition {
    /** The original source file, or null if this information is not available. */
    source: string;
    /** The original identifier, or null if this information is not available. */
    name: string;
}

interface SourceMapConsumer_SourceMapping {
    source: string;
    name: string;
    generatedLine: number;
    generatedColumn: number;
    originalLine: number;
    originalColumn: number;
}

interface SourceMapGenerator_SourceMapping {
    source: string;
    name: string;
    generated: SourceMapPosition;
    original: SourceMapPosition;
}

class insertRemapper {
    private fs = require('fs');
    private SourceMap = require('source-map');
    private generatedJSFileContents : string[];
    private rawSourceMap: any;
    private generatedJSFileMappings : SourceMapConsumer_SourceMapping[];
    public static verboseLoggingToConsole = false;

    constructor(public generatedJSFileName: string,
            public generatedJSMapFileName: string,
            public lineEnding = '\n',
            public encoding = 'utf8') {
        this.generatedJSFileContents = this.fs.readFileSync(generatedJSFileName, this.encoding).split(this.lineEnding);
        this.rawSourceMap = JSON.parse(this.fs.readFileSync(generatedJSMapFileName, this.encoding));
        if (insertRemapper.verboseLoggingToConsole) {
            console.log(JSON.stringify(this.rawSourceMap));
        }
        this.consumeSourceMap();
    }

    private generatedJSFileLineCount() {
        return this.generatedJSFileContents.length;
    }

    private consumeSourceMap() {
        var smc = new this.SourceMap.SourceMapConsumer(this.rawSourceMap);
        this.generatedJSFileMappings = [];
        smc.eachMapping((mapping: SourceMapConsumer_SourceMapping) => {
            this.generatedJSFileMappings.push(mapping);
        }, this, smc.GENERATED_ORDER);
        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogMappings();
        }
    }

    private sourceMappingUrlArrayIndex() {
        for (var i = this.generatedJSFileContents.length -1; i >= 0; i -=1) {
            //todo: fix to regex
            if (this.generatedJSFileContents[i].indexOf("//#") >= 0 && 
                this.generatedJSFileContents[i].indexOf("sourceMappingURL") >= 0 && 
                this.generatedJSFileContents[i].indexOf("=") >= 0) {
                    return i;
            }
        }
        return -1;
    }

    public save(outputJSFileNameAndPath: string = "",
            outputJSMapFileNameAndPath: string = "",
            referencedJSFileNameAndPath: string = outputJSFileNameAndPath,
            sourceMappingUrlOverride: string = ""
            ) {
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

        this.fs.writeFile(outputJSFileNameAndPath, this.generatedJSFileContents.join(this.lineEnding), {encoding:this.encoding});
        
        var smg = new this.SourceMap.SourceMapGenerator({file: referencedJSFileNameAndPath, sourceRoot: this.rawSourceMap.sourceRoot});

        for (var i = 0; i < this.generatedJSFileMappings.length; i+=1) {
            var mapping = this.generatedJSFileMappings[i];
            smg.addMapping({generated: {line: mapping.generatedLine, column: mapping.generatedColumn},
                original: {line: mapping.originalLine, column: mapping.originalColumn},
                source: mapping.source,
                name: mapping.name});
        }

        this.fs.writeFile(outputJSMapFileNameAndPath,
                smg.toString(),
                {encoding:"utf8" /* this encoding is required by the spec */ });
    }

    public insert(codeToInsert: string, oneBasedGeneratedLineNumber: number) {
        var linesToInsert = this.toStringArrayOnNewline(codeToInsert);
        this.generatedJSFileContents = this.insertArrayAt(
            this.generatedJSFileContents,oneBasedGeneratedLineNumber -1, linesToInsert);
        
        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogGeneratedFile();
        }
        
        var insertedLineCount = linesToInsert.length;
        var fileMappingsCount = this.generatedJSFileMappings.length

        for (var i = 0; i < fileMappingsCount; i += 1) {
            if (this.generatedJSFileMappings[i].generatedLine >= oneBasedGeneratedLineNumber) {
                this.generatedJSFileMappings[i].generatedLine += (insertedLineCount + 1);
            }
        }

        if (insertRemapper.verboseLoggingToConsole) {
            this.consoleLogMappings();
        }
    }

    public consoleLogMappings() {
        for (var i = 0; i < this.generatedJSFileMappings.length; i+=1) {
            var mapping = this.generatedJSFileMappings[i];
            console.log("gen " + mapping.generatedLine + "," + mapping.generatedColumn + " => orig " + 
                    mapping.originalLine + "," + mapping.originalColumn + " " + mapping.name + 
                    " (" + mapping.source + ")");
        }
    }

    public consoleLogGeneratedFile() {
        console.log(this.generatedJSFileContents.join(this.lineEnding));
    }

    public prepend(codeToinsert: string) {
        this.insert(codeToinsert, 1);
    }

    public append(codeToinsert: string) {
        this.insert(codeToinsert, this.generatedJSFileLineCount() + 1);
    }

    private toStringArrayOnNewline(theString: string) {
        if ("" + theString === "") {
            return [];
        } else if (theString.indexOf(this.lineEnding) === -1) {
            return [theString];
        }
        return theString.split(this.lineEnding);
    }

    private insertArrayAt(array : any[], index: number, arrayToInsert : any[]) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    }
}


var generatedJSFileName = './Artifacts/Banner10.js';
var modifiedJSFileName = './Artifacts/Banner10modified.js';

insertRemapper.verboseLoggingToConsole = true;
var ir = new insertRemapper(generatedJSFileName, generatedJSFileName + '.map', '\r\n', 'utf8');

ir.insert("//test1\n//test2",12);

ir.save(modifiedJSFileName,modifiedJSFileName + '.map','Banner10Modified.js', 'Banner10Modified.js.map');
