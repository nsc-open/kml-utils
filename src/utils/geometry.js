var Point = require('@turf/helpers').point
var toWgs84 = require('@turf/projection').toWgs84

function isPoint (_) {
  return _.type === 'Point' || _.type === 'MultiPoint'
}

function isPolygon (_) {
  return _.type === 'Polygon' || _.type === 'MultiPolygon'
}

function isLine (_) {
  return _.type === 'LineString' || _.type === 'MultiLineString'
}

function valid (_) {
  return _ && _.type && (
    _.coordinates ||
    _.type === 'GeometryCollection' && _.geometries && _.geometries.every(geometry.valid)
  )
}

function mecatorToWgs84 (point) {
  var pt = Point(point)
  return toWgs84(pt).geometry.coordinates
}

function toWgs84Geometry (geometry) {
  if (geometry.spatialReference && geometry.spatialReference.wkid === 4326) {
    return geometry
  }

  // by default, consider the projection is mecator, try to convert it to wgs84
  if (geometry.rings) { // polygon
    geometry.rings = geometry.rings.map(function (ring) {
      return ring.map(function (point) {
        return mecatorToWgs84(point)
      })
    })
  } else if (geometry.paths) { // polyline
    geometry.paths = geometry.paths.map(function (path) {
      return path.map(function (point) {
        return mecatorToWgs84(point)
      })
    })
  } else if (geometry.points) { // multipoint
    geometry.points = geometry.points.map(function (point) {
      return mecatorToWgs84(point)
    })
  } else { // point
    var x = geometry.x
    var y = geometry.y
    var p = mecatorToWgs84([x, y])
    geometry.x = p[0]
    geometry.y = p[1]
  }
  geometry.spatialReference = { wkid: 4326 }
  return geometry
}

module.exports = {
  isPoint: isPoint,
  isPolygon: isPolygon,
  isLine: isLine,
  valid: valid,
  toWgs84Geometry: toWgs84Geometry
}