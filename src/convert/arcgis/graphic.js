var convert = require('terraformer-arcgis-parser').convert
var symbol = require('./symbol').symbol

function graphicJSON(feature, options) {
  options = options || {
    spatialReference: { wkid: 4326 } // default to wgs84
  }

  var isGeoCollection = feature.geometry.type === 'GeometryCollection'
  var geometry
  var spatialReference = options.spatialReference

  if (isGeoCollection) {
    var _features = feature.geometry.geometries.map(a => {
      return {
        ...JSON.parse(JSON.stringify(feature)),
        geometry: a
      }
    })

    return _features.map(_feature => graphicJSON(_feature, options))
  } else {
    geometry = convert(feature.geometry)
    geometry.spatialReference = spatialReference
  }

  return {
    attributes: feature.properties,
    geometry: geometry,
    symbol: symbol(feature)
  }
}

exports.graphicJSON = graphicJSON