/// <reference path="typings/tsd.d.ts" />
declare class insertRemapper {
    public generatedJSFileName: string;
    public generatedJSMapFileName: string;
    public lineEnding: string;
    public encoding: string;
    private generatedJSFileContents;
    private rawSourceMap;
    private generatedJSFileMappings;
    constructor(generatedJSFileName: string, generatedJSMapFileName: string, lineEnding?: string, encoding?: string);
    private generatedJSFileLineCount();
    private consumeSourceMap();
    private sourceMappingUrlArrayIndex();
    public save(outputJSFileNameAndPath?: string, outputJSMapFileNameAndPath?: string, referencedJSFileNameAndPath?: string, sourceMappingUrlOverride?: string): void;
    public insert(codeToInsert: string, oneBasedGeneratedLineNumber: number): void;
    public consoleLogMappings(): void;
    public consoleLogGeneratedFile(): void;
    public prepend(codeToinsert: string): void;
    public append(codeToinsert: string): void;
    private toStringArrayOnNewline(theString);
    private insertArrayAt(array, index, arrayToInsert);
}
export = insertRemapper;
