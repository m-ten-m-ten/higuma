module.exports = {
  sass: {
    includePaths: ['src/style'],
    indentedSyntax: true,
    outFile: 'style.css',
    sourceMap: 'style.css.map'
  },
  pug: {
  	basedir: 'src',
    // php混在につき、pretty: false
  	pretty: false
  }
}