import * as sass from 'sass'
import * as path from 'path'
import { getFileList, getDistPath, outputFile } from './util'
import { srcDir } from '../config/config'

const sassPtn = path.join(srcDir, '/style/**/!(_)*.scss')

export async function buildSass(): Promise<void> {
  const fileList = await getFileList(sassPtn)
  fileList.forEach(async (file) => {
    const result = await new Promise((resolve, reject) => {
      try {
        resolve(
          sass.renderSync({
            file: file,
            outputStyle: 'compressed',
            sourceMap: true,
            outFile: `${path.basename(file)}.css`,
          })
        )
      } catch (err) {
        console.log(`Sass render error ${file}: ${err}`)
      }
    })
    const cssDistPath = getDistPath('css', file)
    outputFile(cssDistPath, result.css.toString())

    const cssMapDistPath = getDistPath('css.map', file)
    outputFile(cssMapDistPath, result.map.toString())
  })
}

buildSass()
