var get = require('../utils').get
var parseStyle = require('./style').parse
var getPlacemark = require('./placemark').getPlacemark

exports.parseGeoJSON = function (doc) {
	var features = []
  var placemarks = get(doc, 'Placemark')    
  var parsedStyle = parseStyle(doc)
  var styleIndex = parsedStyle.styleIndex
  var styleByHash = parsedStyle.styleByHash
  var styleMapIndex = parsedStyle.styleMapIndex

  for (var j = 0; j < placemarks.length; j++) {
    features.push(getPlacemark(placemarks[j], styleIndex, styleMapIndex, styleByHash))
	}

  return {
		type: 'FeatureCollection',
    features: features
	}
}