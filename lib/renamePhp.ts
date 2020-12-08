import * as path from 'path'
import * as fs from 'fs-extra'
import { distDir } from '../config/config'
import { getFileList, changeExt } from './util'

const phpPtn = path.join(distDir, '/+(form|sent).html')

// .html → .php
export async function renamePhp(): Promise<void> {
  const fileList = await getFileList(phpPtn)
  if (fileList.length >= 1) {
    fileList.forEach((file) => {
      fs.rename(file, changeExt('php', file), (err) => {
        if (err) console.error(err)
      })
    })
  }
}

renamePhp()
