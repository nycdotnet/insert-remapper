/// <reference path="../typings/tsd.d.ts" />
import path = require("path");
import fs = require('fs');
import InsertRemapper = require('../index');

var copyFileSync = function (srcFile: string, destFile: string) { 
    var content = fs.readFileSync(srcFile); 
    fs.writeFileSync(destFile, content);
} 

var setup = function () {
    copyFileSync(path.join(__dirname, '../Artifacts/Banner1.js'), path.join(__dirname, './banner1.js'));
    copyFileSync(path.join(__dirname, '../Artifacts/Banner1.js.map'), path.join(__dirname, './banner1.js.map'));
    copyFileSync(path.join(__dirname, '../Artifacts/Banner1.ts'), path.join(__dirname, './banner1.ts'));
}


var prepend = function () {
    var ir = new InsertRemapper("./integration/banner1.js", "./integration/banner1.js.map", {});
    ir.prepend("//this is a test\n//testing also\n//still testing!!!");
    ir.save("./integration/banner1.js", "./integration/banner1.js.map", "banner1.js", "");
}

var append = function () {
    var ir = new InsertRemapper("./integration/banner1.js", "./integration/banner1.js.map", {});
    ir.append("//this is a test");
    ir.save("./integration/banner1.js", "./integration/banner1.js.map", "banner1.js", "");
}

var insert = function () {
    var ir = new InsertRemapper("./integration/banner1.js", "./integration/banner1.js.map", {});
    ir.insert("//this is a test",4);
    ir.save("./integration/banner1.js", "./integration/banner1.js.map", "banner1.js", "");
}

setup();
insert();
append();
prepend();

