var convert = require('terraformer-arcgis-parser').convert
var symbol = require('./symbol').symbol

function graphicJSON (feature) {
  var isGeoCollection = feature.geometry.type === 'GeometryCollection'
  var geometry

  if (isGeoCollection) {
    var geometries = convert(feature.geometry)
    var type = feature.geometry.geometries[0] && feature.geometry.geometries[0].type
    geometry = { spatialReference: { wkid: 4326 } } // wgs84

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
    geometry.spatialReference = { wkid: 4326 } // wgs84
  }

  return {
    attributes: feature.properties,
    geometry: geometry,
    symbol: symbol(feature)
  } 
}

exports.graphicJSON = graphicJSON