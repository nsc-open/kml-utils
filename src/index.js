
var get = require('./utils').get
var parseStyle = require('./parse/style').parse
var parsePlacemark = require('./parse/placemark').parse
var parseFolder = require('./parse/folder').parse

function parseGeoJSON (doc) {
	var features = []
  var placemarks = get(doc, 'Placemark')    
  var stylePropertiesSetter = parseStyle(doc, { returnPropertiesSetter: true })

  for (var j = 0; j < placemarks.length; j++) {
    features.push(parsePlacemark(placemarks[j], stylePropertiesSetter))
	}

  return {
		type: 'FeatureCollection',
    features: features
	}
}

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