"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bs = require("browser-sync");
const path = require("path");
const gaze = require("gaze");
const config_1 = require("../config/config");
const sass_1 = require("./sass");
const pug_1 = require("./pug");
const copy_1 = require("./copy");
const renamePhp_1 = require("./renamePhp");
function startServer() {
    bs.init({
        server: config_1.distDir,
        files: path.join(config_1.distDir, '/**/+(*.html|*.js|*.css|*.jpg|*.png|*.ico)'),
    });
    gaze(path.join(config_1.srcDir, '/**/*.scss'), (err, watcher) => {
        if (err)
            console.error(err);
        watcher.on('all', (err, file) => {
            sass_1.buildSass();
        });
    });
    gaze(path.join(config_1.srcDir, '/**/*.pug'), (err, watcher) => {
        if (err)
            console.error(err);
        watcher.on('all', (err, file) => {
            pug_1.buildPug();
        });
    });
    gaze([
        path.join(config_1.srcDir, '/+(media|script)/*.*'),
        path.join(config_1.srcDir, 'favicon.ico'),
    ], (err, watcher) => {
        if (err)
            console.error(err);
        watcher.on('all', (err, file) => {
            copy_1.copyFiles();
        });
    });
    gaze(path.join(config_1.distDir, '/*.html'), (err, watcher) => {
        if (err)
            console.error(err);
        watcher.on('added', (err, file) => {
            renamePhp_1.renamePhp();
        });
    });
}
startServer();
