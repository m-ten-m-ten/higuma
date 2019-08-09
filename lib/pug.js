const pug = require('pug')
module.exports = function buildPug (option, buffer) {
  return new Promise((resolve, reject) => {
    pug.render(buffer.toString(), option, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}