var convert = require('terraformer-arcgis-parser').convert
var symbol = require('./symbol').symbol

function graphicJSON (feature, options) {
  options = options || {
    spatialReference: { wkid: 4326 } // default to wgs84
  }

  var isGeoCollection = feature.geometry.type === 'GeometryCollection'
  var geometry
  var spatialReference = options.spatialReference

  if (isGeoCollection) {
    var geometries = convert(feature.geometry)
    var type = feature.geometry.geometries[0] && feature.geometry.geometries[0].type
    geometry = { spatialReference }

    if (type === 'Point') {
      geometry.points = geometries.map(function (g) {
        return [g.x, g.y, g.z || 0]
      })
    } else if (type === 'LineString') {
      geometry.paths = []
      geometries.forEach(function (g) {
        g.paths.forEach(function (path) {
          geometry.paths.push(path)
        })
      })
    } else if (type === 'Polygon') {
      geometry.rings = []
      geometries.forEach(function (g) {
        g.rings.forEach(function (ring) {
          geometry.rings.push(ring)
        })
      })
    }
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