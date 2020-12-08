"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFiles = void 0;
const path = require("path");
const fs = require("fs-extra");
const config_1 = require("../config/config");
// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリスト
const copyList = ['media', 'script', 'favicon.ico'];
// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリストのコピー実施
function copyFiles() {
    copyList.forEach((list) => {
        fs.copy(path.join(config_1.srcDir, list), path.join(config_1.distDir, list), (err) => {
            if (err)
                return console.error(err);
        });
    });
}
exports.copyFiles = copyFiles;
copyFiles();
