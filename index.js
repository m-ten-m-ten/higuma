const bs     = require('browser-sync').create()
const gaze   = require('gaze')
const fs     = require('fs-extra')
const path   = require('path')
const glob   = require('glob')
const sass   = require('./lib/sass')
const config = require('./config/config')
const pug    = require('./lib/pug')
const cmd    = process.argv[2]

let srcDir = 'src'
let distDir = 'public'
let sassPtn = path.join(srcDir, '/style/**/!(_)*.sass')
let pugPtn = path.join(srcDir, '/**/!(_)*.pug')
let phpPtn = path.join(distDir, '/?(form|sent).html')
// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリスト
let copyList = ['media', 'script', 'favicon.ico']

/* ターミナルから受け取ったコマンドを実行 */
// ----------------

switch (cmd) {
  case 'sass':
    buildSass()
    break
  case 'pug':
    buildPug()
    break
  case 'copy':
    copyFiles()
    break
  case 'php':
    renamePhp()
    break
  case 'server':
    startServer(config.server)
    break
}


/* ビルド関数 */
// ----------------

function buildSass () {
  fileList(sassPtn)
  .then(files => {
    Promise.all(files.map(file => {
      readFile(file)
      .then(sass.bind(null, config.sass))
      .then(data => {
        outputFile(distPath('css', file), data.css.toString())
        outputFile(distPath('css.map', file), data.map)
      })
      .catch(err => console.error(err))
    }))
  })
  .then(() => console.log('Sass build finished!'))
  .catch(err => console.error(err))
}

function buildPug () {
  fileList(pugPtn)
  .then(files => {
    Promise.all(files.map(file => {
      readFile(file)
      .then(pug.bind(null, config.pug))
      .then(outputFile.bind(null, distPath('html', file)))
      .catch(err => console.error(err))
    }))
  })
  .then(() => console.log('Pug build finished!'))
  .catch(err => console.error(err))
}

// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリストのコピー実施
function copyFiles () {
  copyList.forEach(list => {
    fs.copy(path.join(srcDir, list), path.join(distDir, list), err => {
      if (err) return console.error(err)
    })
  })
console.log('Copy files finish!')
}

// .html → .php
function renamePhp () {
  fileList(phpPtn)
  .then(files => {
    Promise.all(files.map(file => {
      fs.rename(file, changeExt('php', file), (err) => {
        if (err) console.error(err)
      })
    }))
  })
  .then(() => console.log('.html to .php rename finished!'))
}


function startServer () {
  bs.init({
    server: distDir,
    files: path.join(distDir, '/**/+(*.html|*.js|*.css|*.jpg|*.png|*.ico)')
  })
  gaze(path.join(srcDir, '/**/*.sass'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (ev, file) => {
      buildSass()
    })
  })
  gaze(path.join(srcDir, '/**/*.pug'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (ev, file) => {
      buildPug(config.pug, file)
    })
  })
  gaze(path.join(srcDir, '/**/*.*'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (ev, file) => {
      copyFiles()
    })
  })
  gaze(path.join(distDir, '/*.html'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('added', (ev, file) => {
      renamePhp()
    })
  })
}

/* ユーティリティ */
// ----------------

function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err)
      else {
        resolve(data);
      }
    })
  })
}

function fileList (pattern, option = {}) {
  return new Promise((resolve, reject) => {
    glob(pattern, option, (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}

function outputFile (file, data) {
  return new Promise((resolve, reject) => {
    fs.outputFile(file, data, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function distPath (ext, file) {
  let parse = path.parse(file)
  return path.join(parse.dir.replace(srcDir, distDir), `${parse.name}.${ext}`)
}

function changeExt (ext, file) {
  let parse = path.parse(file)
  return path.join(parse.dir, `${parse.name}.${ext}`)
}