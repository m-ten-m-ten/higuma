import * as path from 'path'
import * as glob from 'glob'
import * as fs from 'fs-extra'
import { srcDir, distDir } from './config/config'

export function outputFile(distPath: string, data: string): void {
  fs.outputFile(distPath, data, (err) => {
    if (err) console.log(`File output error (path: ${distPath}): ${err}`)
  })
}

export async function getFileList(ptn: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(ptn, (err, files) => {
      if (err) reject(`Glob error (pattern: ${ptn}): ${err}`)
      resolve(files)
    })
  })
}

export function getDistPath(ext: string, file: string): string {
  const parse = path.parse(file)
  return path.join(parse.dir.replace(srcDir, distDir), `${parse.name}.${ext}`)
}

export function changeExt(ext: string, file: string): string {
  const parse = path.parse(file)
  return path.join(parse.dir, `${parse.name}.${ext}`)
}
