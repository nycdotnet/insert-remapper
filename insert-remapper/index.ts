///<reference path="typings/tsd.d.ts" />

import fs = require('fs');
import SourceMap = require('source-map');

class InsertRemapper {
    private generatedJSFileContents : string[];
    private rawSourceMap: any;
    private generatedJSFileMappings: SourceMap.MappingItem[];
    private external = InsertRemapper.externalAPI;

    public static externalAPI = {
        readFileSync: (inputFileName: string, encoding: string) => {
            return fs.readFileSync(inputFileName, encoding);
        },
        writeFileSync: (outputFileName: string, data: string,  encoding: string) => {
            fs.writeFileSync(outputFileName, data, { encoding: encoding });
        },
        writeResults: <any>[] 
    };

    constructor(public generatedJSFileName: string,
            public generatedJSMapFileName: string,
            public lineEnding = '\n',
            public encoding = 'utf8') {
        this.generatedJSFileContents = this.external.readFileSync(generatedJSFileName, this.encoding).split(this.lineEnding);
        this.rawSourceMap = JSON.parse(this.external.readFileSync(generatedJSMapFileName, this.encoding));
        this.consumeSourceMap();
    }

    private generatedJSFileLineCount() {
        return this.generatedJSFileContents.length;
    }

    private consumeSourceMap() {
        var smc : SourceMap.SourceMapConsumer = new SourceMap.SourceMapConsumer(this.rawSourceMap);
        this.generatedJSFileMappings = [];
        smc.eachMapping((mapping: SourceMap.MappingItem) => {
            this.generatedJSFileMappings.push(mapping);
        }, this, SourceMap.SourceMapConsumer.GENERATED_ORDER);
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

        this.external.writeFileSync(outputJSFileNameAndPath, this.generatedJSFileContents.join(this.lineEnding), this.encoding);
        
        var smg : SourceMap.SourceMapGenerator = new SourceMap.SourceMapGenerator({file: referencedJSFileNameAndPath, sourceRoot: this.rawSourceMap.sourceRoot});

        for (var i = 0; i < this.generatedJSFileMappings.length; i+=1) {
            var mapping = this.generatedJSFileMappings[i];
            smg.addMapping({generated: {line: mapping.generatedLine, column: mapping.generatedColumn},
                original: {line: mapping.originalLine, column: mapping.originalColumn},
                source: mapping.source,
                name: mapping.name});
        }

        this.external.writeFileSync(outputJSMapFileNameAndPath,
                smg.toString(),
                "utf8" /* UTF-8 is required by the spec */);
    }

    public insert(codeToInsert: string, oneBasedGeneratedLineNumber: number) {
        var linesToInsert = this.toStringArrayOnNewline(codeToInsert);
        this.generatedJSFileContents = this.insertArrayAt(
            this.generatedJSFileContents,oneBasedGeneratedLineNumber -1, linesToInsert);
        
        var insertedLineCount = linesToInsert.length;
        var fileMappingsCount = this.generatedJSFileMappings.length

        for (var i = 0; i < fileMappingsCount; i += 1) {
            if (this.generatedJSFileMappings[i].generatedLine >= oneBasedGeneratedLineNumber) {
                this.generatedJSFileMappings[i].generatedLine += (insertedLineCount + 1);
            }
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

export = InsertRemapper;