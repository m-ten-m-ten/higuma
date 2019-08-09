const bs     = require('browser-sync').create()
const gaze   = require('gaze')
const fs     = require('fs-extra')
const path   = require('path')
const glob   = require('glob')
const sass   = require('./lib/sass')
const config = require('./config/config')
const pug    = require('./lib/pug')
const cmd    = process.argv[2]
const copyDir = process.argv[3]

let srcDir = 'src'
let distDir = 'public'
let sassPtn = path.join(srcDir, '/style/**/!(_)*.sass')
let pugPtn = path.join(srcDir, '/**/!(_)*.pug')
let jsDir = '/script'
let mediaDir = '/media'

/* ターミナルから受け取ったコマンドを実行 */
switch (cmd) {
  case 'sass':
    buildSass()
    break
  case 'pug':
    buildPug()
    break
  case 'server':
    startServer(config.server)
    break
  case 'copy':
    fileCopy(copyDir)
    break
}

/* ビルド関数 */
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


function startServer () {
  bs.init({
    server: distDir,
    files: path.join(distDir, '/**/+(*.html|*.js|*.css|*.jpg|*.png)')
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
  gaze(path.join(srcDir, '/script/*.js'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (ev, file) => {
      fileCopy(jsDir)
    })
  })
  gaze(path.join(srcDir, '/media/*'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (ev, file) => {
      fileCopy(mediaDir)
    })
  })
}

/* ユーティリティ */

// srcからpublicにそのままコピーするもの
function fileCopy (dir) {
  fs.copy(path.join(srcDir, dir), path.join(distDir, dir), err => {
    if (err) return console.error(err)
    console.log(dir + ' file copy finished')
  })
}

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