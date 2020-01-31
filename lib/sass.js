const sass = require('node-sass')
module.exports = function buildSass (option, buffer) {
  let arg = Object.assign(option, {data: buffer.toString()})
  return new Promise((resolve, reject) => {
    sass.render(arg, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}