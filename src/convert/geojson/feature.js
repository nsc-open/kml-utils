var parse = require('terraformer-arcgis-parser').parse
var geoUtils = require('../../utils/geometry')
var styleProperties = require('./properties').styleProperties

exports.toFeature = function (graphicJSON) {
  return {
    type: 'Feature',
    geometry: parse(geoUtils.toWgs84Geometry(graphicJSON.geometry)),
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