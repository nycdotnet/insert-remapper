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

var mappedLines = (<string>rawSourceMap.mappings).split(';');

console.log(mappedLines.length);

console.log(mappedLines.join("\n"));


//var dan = Base64.encode('dankogai');  // ZGFua29nYWk=
//var map = Base64.decode("AAAA");
//console.log(map);



////Originally from http://vabate.com/convert-a-base64-encoded-string-to-binary-with-javascript/
//// Now with significant modifications.
//function binEncode(data) {

//    //array holds the initial set of un-padded binary results
//    var binArray = [];

//    //the string to hold the padded results
//    var datEncode = "";

//    //encode each character in data to it's binary equiv and push it into an array
//    for (var i = 0; i < data.length; i++) {
//        binArray.push(data[i].charCodeAt(0).toString(2));

//    }

//    //loop through binArray to pad each binary entry.
//    for (var j = 0; j < binArray.length; j++) {
//        //pad the binary result with zeros to the left to ensure proper 8 bit binary
//        var pad = padding_left(binArray[j], '0', 8);

//        //append each result into a string
//        datEncode += pad + ' ';

//    }
//}

//function padding_left(s, c, n) {
//    if (!s || !c || s.length >= n) {
//        return s;
//    }

//    var max = (n - s.length) / c.length;
//    for (var i = 0; i < max; i++) {
//        s = c + s;
//    }

//    return s;
//}

//var myString = "VGhhbmtzIEZvciBSZWFkaW5nIQ==";
//console.log("myString:");
//console.log(myString);
//console.log("As Binary:");
//console.log(binEncode(myString));

