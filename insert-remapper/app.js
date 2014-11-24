/*
 What we need to do:
 Open the generated JS file and JS Map.
 Read through the map, identifying the corresponding location from the original source file - cache all of this.
 Then output the new JS file and set up a new map, re-using all of the cached mapping info except this time with extra
  lines added.

*/
var SourceMap = require('source-map');
var Base64 = require('js-base64').Base64;
var fs = require('fs');
var rawSourceMap = JSON.parse(fs.readFileSync('./Artifacts/Banner10.js.map', 'utf8'));
var smc = new SourceMap.SourceMapConsumer(rawSourceMap);
console.log(smc.sources.join("\n"));
//console.log(rawMap.mappings);
var mappedLines = rawSourceMap.mappings.split(';');
console.log(mappedLines.length);
console.log(mappedLines.join("\n"));
//# sourceMappingURL=app.js.map