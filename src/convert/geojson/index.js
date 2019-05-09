var parse = require('terraformer-arcgis-parser').parse
var geoUtils = require('../../utils/geometry')

function toFeature (geometryJson) {
  return {
    type: 'Feature',
    geometry: parse(geoUtils.toWgs84Geometry(geometryJson.geometry)),
    properties: Object.assign({}, geometryJson.attributes)
  }
}

function toFeatureCollection (geometryJsons) {
  var features = (geometryJsons || []).map(toFeature)
  return {
    type: 'FeatureCollection',
    features
  }
}

module.exports = {
  toFeature: toFeature,
  toFeatureCollection: toFeatureCollection
}