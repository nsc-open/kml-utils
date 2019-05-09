var fs = require('fs-extra')
var path = require('path')
var kmlify = require('../src/index').kmlify

var json = fs.readJsonSync('./arcgis-jsons/styled-polyline.json')
var kmlString = kmlify([json], [], { dataType: 'arcjson' })

fs.outputFileSync(path.resolve(__dirname, `./${Date.now()}.kml`), kmlString)