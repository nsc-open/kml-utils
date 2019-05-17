var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse
var arcgisConvertor = require('../src/index').arcgisConvertor

var kmlDom = new DOMParser().parseFromString(fs.readFileSync('./kmls/路径0803.kml', 'utf8'))
var r = parse(kmlDom, { style: true })

r.graphicJSON = r.geoJSON.features.map(f => {
  console.log('-', f.properties)
  return arcgisConvertor.graphicJSON(f)
})


fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), JSON.stringify(r.graphicJSON))