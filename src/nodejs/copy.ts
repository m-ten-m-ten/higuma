import * as path from 'path'
import * as fs from 'fs-extra'
import { srcDir, distDir } from './config/config'
import { copySrcToDistList, copyRootToDistList } from './config/config'

// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリストのコピー実施
export function copyFiles(): void {
  copySrcToDistList.forEach((list) => {
    fs.copy(path.join(srcDir, list), path.join(distDir, list), (err) => {
      if (err) return console.error(err)
    })
  })
  copyRootToDistList.forEach((list) => {
    fs.copy(list, path.join(distDir, list), (err) => {
      if (err) return console.error(err)
    })
  })
}

copyFiles()
