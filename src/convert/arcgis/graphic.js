const convert = require('terraformer-arcgis-parser').convert
const symbol = require('./symbol').symbol

const defaultOptions = {
  spatialReference: { wkid: 4326 }, // default to wgs84
  geometryCollection: {
    mergePoint: true,
    mergePolyline: true,
    mergePolygon: true,
  }
}

/** geojson转graphicjson
 * GeometryCollection, 将相同类型的要素合并
 * Feature: { type, properties, geometry: { type, coordinates }}
 * Point
 * MultiPoint
 * LineString
 * MultiLineString
 * Polygon
 * MultiPolygon
 * GeometryCollection
 *  */
function graphicJSON(feature, options) {
  if (!feature) return null
  let { spatialReference, geometryCollection } = { ...defaultOptions, ...options }

  let isGeoCollection = feature.geometry.type === 'GeometryCollection'
  let geometry

  if (isGeoCollection) {
    let _features = feature.geometry.geometries.reduce(function (s, a, i) {
      a = JSON.parse(JSON.stringify(a))
      if (geometryCollection.mergePoint && ['Point', 'MultiPoint'].includes(a.type)) {
        return pushCoords(s, 'MultiPoint', a, feature)
      } else if (geometryCollection.mergePolyline && ['LineString', 'MultiLineString'].includes(a.type)) {
        return pushCoords(s, 'MultiLineString', a, feature)
      } else if (geometryCollection.mergePolygon && ['Polygon', 'MultiPolygon'].includes(a.type)) {
        return pushCoords(s, 'MultiPolygon', a, feature)
      } else {
        console.log('geometry.type error = ', a.type)
      }
      return s
    }, [])

    return _features.map(function (_feature) {
      return graphicJSON(_feature, options)
    })
  } else {
    geometry = convert(feature.geometry)
    geometry.spatialReference = spatialReference
  }

  return {
    attributes: feature.properties,
    geometry,
    symbol: symbol(feature)
  }
}

function pushCoords(s, gtype, a, feature) {
  let index = s.findIndex(function (b) {
    return b.geometry.type === gtype
  })
  if (index >= 0) {
    s[index].geometry.coordinates.push(a.coordinates)
    return s
  } else {
    if (a.type !== gtype) {
      a.type = gtype
      a.coordinates = [a.coordinates]
    }
    let _feature = {
      ...JSON.parse(JSON.stringify(feature)),
      geometry: a
    }
    s.push(_feature)
    return s
  }
}

exports.graphicJSON = graphicJSON