import * as bs from 'browser-sync'
import * as path from 'path'
import * as gaze from 'gaze'
import { srcDir, distDir } from '../config/config'
import { buildSass } from './sass'
import { buildPug } from './pug'
import { copyFiles } from './copy'
import { renamePhp } from './renamePhp'

function startServer() {
  bs.init({
    server: distDir,
    files: path.join(distDir, '/**/+(*.html|*.js|*.css|*.jpg|*.png|*.ico)'),
  })
  gaze(path.join(srcDir, '/**/*.scss'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (err, file) => {
      buildSass()
    })
  })
  gaze(path.join(srcDir, '/**/*.pug'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (err, file) => {
      buildPug()
    })
  })
  gaze(
    [
      path.join(srcDir, '/+(media|script)/*.*'),
      path.join(srcDir, 'favicon.ico'),
    ],
    (err, watcher) => {
      if (err) console.error(err)
      watcher.on('all', (err, file) => {
        copyFiles()
      })
    }
  )
  gaze(path.join(distDir, '/*.html'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('added', (err, file) => {
      renamePhp()
    })
  })
}

startServer()
