var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse

var graphicJSON = require('../src/convert/arcgis/graphic').graphicJSON

var kmlDom = new DOMParser().parseFromString(fs.readFileSync('./kmls/styled-polygon.kml', 'utf8'))
var r = parse(kmlDom, { style: true })

r.graphicJSON = r.geoJSON.features.map(f => graphicJSON(f))


fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), JSON.stringify(r.graphicJSON))