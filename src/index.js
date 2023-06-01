
var domUtils = require('./utils/dom')
var parseStyle = require('./parse/style').parse
var parsePlacemark = require('./parse/placemark').parse
var parseFolder = require('./parse/folder').parse

var arcgisConvertor = require('./convert/arcgis')
var geoJSONConvertor = require('./convert/geojson')
var kmlify = require('./kmlify')
var ElementParser = require('./utils/ElementParser')

/**
 * 
 * @param {*} doc elementParser object
 * @param {Object} options { style, callbackAttrs }
 */
function parseGeoJSON (doc, options) {
  options = Object.assign({ style: true, propertyCallbacks: null }, options)
	var features = []
  var placemarks = domUtils.get(doc, 'Placemark')    
  var stylePropertiesSetter = (options && options.style) ? parseStyle(doc, { returnPropertiesSetter: true }) : null

  for (var j = 0; j < placemarks.length; j++) {
    features.push(parsePlacemark(placemarks[j], stylePropertiesSetter, options))
	}

  return {
		type: 'FeatureCollection',
    features: features
	}
}

function parse (kmlDocument, options) {
  var defaultOptions = {
    folderElements: ['Folder'],
  }
  options = Object.assign(defaultOptions, options || {})

  var doc = new ElementParser(kmlDocument).tree

  var folders = parseFolder(doc, options)
  var featureCollection = parseGeoJSON(doc, options)

  return {
    geoJSON: featureCollection,
    folders: folders
  }
}

exports.parse = parse
exports.parseFolder = parseFolder
exports.parseGeoJSON = parseGeoJSON
exports.arcgisConvertor = arcgisConvertor
exports.geoJSONConvertor = geoJSONConvertor
exports.kmlify = kmlify