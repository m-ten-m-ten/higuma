"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSass = void 0;
const sass = require("sass");
const path = require("path");
const util_1 = require("./util");
const config_1 = require("../config/config");
const sassPtn = path.join(config_1.srcDir, '/style/**/!(_)*.scss');
async function buildSass() {
    const fileList = await util_1.getFileList(sassPtn);
    fileList.forEach(async (file) => {
        const result = await new Promise((resolve, reject) => {
            try {
                resolve(sass.renderSync({
                    file: file,
                    outputStyle: 'compressed',
                    sourceMap: true,
                    outFile: `${path.basename(file)}.css`,
                }));
            }
            catch (err) {
                console.log(`Sass render error ${file}: ${err}`);
            }
        });
        const cssDistPath = util_1.getDistPath('css', file);
        util_1.outputFile(cssDistPath, result.css.toString());
        const cssMapDistPath = util_1.getDistPath('css.map', file);
        util_1.outputFile(cssMapDistPath, result.map.toString());
    });
}
exports.buildSass = buildSass;
buildSass();
