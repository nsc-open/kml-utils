var fs = require('fs-extra')
var path = require('path')
var kmlify = require('../src/index').kmlify

var fileContent = fs.readJsonSync('parse-result.json')
var json = JSON.parse(fileContent)
var kmlString = kmlify(json.geoJSON, json.folders)

fs.outputFileSync(path.resolve(__dirname, `./${Date.now()}.kml`), kmlString)