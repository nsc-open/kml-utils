var parseFolder = require('./parse/folder').parseFolder
var parseGeoJSON = require('./parse/geojson').parseGeoJSON

function parse (kmlDocument) {
  var folders = parseFolder(kmlDocument)
  var featureCollection = parseGeoJSON(kmlDocument)

  return {
    geoJSON: featureCollection,
    folders: folders
  }
}

exports.parse = parse
exports.parseFolder = parseFolder
exports.parseGeoJSON = parseGeoJSON