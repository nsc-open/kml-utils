var parse = require('terraformer-arcgis-parser').parse
var geoUtils = require('../../utils/geometry')
var styleProperties = require('./properties').styleProperties

exports.toFeature = function (graphicJSON) {
  return {
    type: 'Feature',
    geometry: parseEsriGeometry(geoUtils.toWgs84Geometry(graphicJSON.geometry)),
    properties: Object.assign({}, graphicJSON.attributes, styleProperties(graphicJSON))
  }
}

exports.toFeatureCollection = function (graphicJSONs) {
  var features = (graphicJSONs || []).map(exports.toFeature)
  return {
    type: 'FeatureCollection',
    features
  }
}

// INFO: 修复 terraformer-arcgis-parser bug
function parseEsriGeometry(geometry) {
  var _geometry = parse(geoUtils.toWgs84Geometry(geometry))
  // 挖洞：单个 ring 需要转换成 polygon
  if (geometry.hasOwnProperty('rings') && _geometry.type === 'MultiPolygon') {
    _geometry.type = 'Polygon'

    _geometry.coordinates = _geometry.coordinates.reduce(function (s, a) {
      s.push(a[0])
      return s
    }, [])
  }

  return _geometry
}