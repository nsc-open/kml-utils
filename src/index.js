
var get = require('./utils').get
var parseStyle = require('./parse/style').parse
var parsePlacemark = require('./parse/placemark').parse
var parseFolder = require('./parse/folder').parse

/**
 * 
 * @param {*} doc kmlDom object
 * @param {Object} options { style }
 */
function parseGeoJSON (doc, options) {
	var features = []
  var placemarks = get(doc, 'Placemark')    
  var stylePropertiesSetter = (options && options.style) ? parseStyle(doc, { returnPropertiesSetter: true }) : null

  for (var j = 0; j < placemarks.length; j++) {
    features.push(parsePlacemark(placemarks[j], stylePropertiesSetter))
	}

  return {
		type: 'FeatureCollection',
    features: features
	}
}

function parse (kmlDocument, options) {
  var folders = parseFolder(kmlDocument)
  var featureCollection = parseGeoJSON(kmlDocument, options)

  return {
    geoJSON: featureCollection,
    folders: folders
  }
}

exports.parse = parse
exports.parseFolder = parseFolder
exports.parseGeoJSON = parseGeoJSON