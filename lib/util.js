"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeExt = exports.getDistPath = exports.getFileList = exports.outputFile = void 0;
const path = require("path");
const glob = require("glob");
const fs = require("fs-extra");
const config_1 = require("../config/config");
function outputFile(distPath, data) {
    fs.outputFile(distPath, data, (err) => {
        if (err)
            console.log(`File output error (path: ${distPath}): ${err}`);
    });
}
exports.outputFile = outputFile;
async function getFileList(ptn) {
    return new Promise((resolve, reject) => {
        glob(ptn, (err, files) => {
            if (err)
                reject(`Glob error (pattern: ${ptn}): ${err}`);
            resolve(files);
        });
    });
}
exports.getFileList = getFileList;
function getDistPath(ext, file) {
    const parse = path.parse(file);
    return path.join(parse.dir.replace(config_1.srcDir, config_1.distDir), `${parse.name}.${ext}`);
}
exports.getDistPath = getDistPath;
function changeExt(ext, file) {
    const parse = path.parse(file);
    return path.join(parse.dir, `${parse.name}.${ext}`);
}
exports.changeExt = changeExt;
