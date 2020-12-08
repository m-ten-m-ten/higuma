"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPug = void 0;
const pug = require("pug");
const path = require("path");
const util_1 = require("./util");
const config_1 = require("../config/config");
const pugPtn = path.join(config_1.srcDir, '/**/!(_)*.pug');
const pugOptions = { basedir: 'src' };
async function buildPug() {
    try {
        const fileList = await util_1.getFileList(pugPtn);
        fileList.forEach(async (file) => {
            const html = await getHtmlFromPug(file, pugOptions);
            const distPath = util_1.getDistPath('html', file);
            util_1.outputFile(distPath, html);
        });
    }
    catch (err) {
        if (err)
            console.log(`Build Pug error: ${err}`);
    }
}
exports.buildPug = buildPug;
async function getHtmlFromPug(file, options) {
    return new Promise((resolve, reject) => {
        pug.renderFile(file, options, (err, html) => {
            if (err)
                reject(`Pug render error (file: ${file}): ${err}`);
            resolve(html);
        });
    });
}
buildPug();
