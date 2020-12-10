import * as pug from 'pug'
import * as path from 'path'
import { getFileList, getDistPath, outputFile } from './util'
import { srcDir } from './config/config'

const pugPtn = path.join(srcDir, '/**/!(_)*.pug')
const pugOptions = { basedir: 'src' }

export async function buildPug(): Promise<void> {
  try {
    const fileList = await getFileList(pugPtn)
    fileList.forEach(async (file) => {
      const html = await getHtmlFromPug(file, pugOptions)
      const distPath = getDistPath('html', file)
      outputFile(distPath, html)
    })
  } catch (err) {
    if (err) console.log(`Build Pug error: ${err}`)
  }
}

async function getHtmlFromPug(file: string, options): Promise<string> {
  return new Promise((resolve, reject) => {
    pug.renderFile(file, options, (err, html) => {
      if (err) reject(`Pug render error (file: ${file}): ${err}`)
      resolve(html)
    })
  })
}

buildPug()
