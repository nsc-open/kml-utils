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

function any (_) {
  if (geometry[_.type]) {
    return geometry[_.type](_)
  } else {
    return ''
  }
}

module.exports = {
  isPoint: isPoint,
  isPolygon: isPolygon,
  isLine: isLine,
  valid: valid,
  any: any
}