import * as bs from 'browser-sync'
import * as path from 'path'
import * as gaze from 'gaze'
import { srcDir, distDir } from './config/config'
import { buildPug } from './pug'
import { copyFiles } from './copy'
import { renamePhp } from './renamePhp'
import { copySrcToDistList, copyRootToDistList } from './config/config'

// copyFiles監視対象の配列
const listForCopyFiles = []

copySrcToDistList.forEach((list) => {
  if (list.includes('.')) {
    listForCopyFiles.push(path.join(srcDir, '/', list))
  } else {
    listForCopyFiles.push(path.join(srcDir, '/', list, '/*.*'))
  }
})

copyRootToDistList.forEach((list) => {
  if (list.includes('.')) {
    listForCopyFiles.push(list)
  } else {
    listForCopyFiles.push(list + '/*.*')
  }
})

function startServer() {
  bs.init({
    server: distDir,
    files: path.join(distDir, '/**/+(*.html|*.php|*.js|*.jpg|*.png|*.ico)'),
  })

  gaze(path.join(srcDir, '/**/*.pug'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (err, file) => {
      buildPug()
    })
  })

  gaze(listForCopyFiles, (err, watcher) => {
    if (err) console.error(err)
    watcher.on('all', (err, file) => {
      copyFiles()
    })
  })

  gaze(path.join(distDir, '/*.html'), (err, watcher) => {
    if (err) console.error(err)
    watcher.on('added', (err, file) => {
      renamePhp()
    })
  })
}

startServer()
