"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renamePhp = void 0;
const path = require("path");
const fs = require("fs-extra");
const config_1 = require("../config/config");
const util_1 = require("./util");
const phpPtn = path.join(config_1.distDir, '/+(form|sent).html');
// .html → .php
async function renamePhp() {
    const fileList = await util_1.getFileList(phpPtn);
    if (fileList.length >= 1) {
        fileList.forEach((file) => {
            fs.rename(file, util_1.changeExt('php', file), (err) => {
                if (err)
                    console.error(err);
            });
        });
    }
}
exports.renamePhp = renamePhp;
renamePhp();
