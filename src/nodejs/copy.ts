import * as path from 'path'
import * as fs from 'fs-extra'
import { srcDir, distDir } from './config/config'

// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリスト
const copyList = ['media', 'script', 'favicon.ico']

// srcフォルダからそのままのフォルダ構成でコピーするファイル・フォルダのリストのコピー実施
export function copyFiles(): void {
  copyList.forEach((list) => {
    fs.copy(path.join(srcDir, list), path.join(distDir, list), (err) => {
      if (err) return console.error(err)
    })
  })
}

copyFiles()
