module.exports = {
  entry: './src/index.js',
  output: {
    filename: './kml-utils.min.js',
    library: 'kmlUtils',
    libraryTarget: 'window'
  },
  externals: {
    jsdom: 'jsdom'
  }
}