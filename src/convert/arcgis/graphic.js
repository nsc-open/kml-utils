var convert = require('terraformer-arcgis-parser').convert
var symbol = require('./symbol').symbol

function graphicJSON (feature) {
  const geometry = convert(feature.geometry)
  geometry.spatialReference = { wkid: 4326 } // wgs84
  return {
    attributes: feature.properties,
    geometry: geometry,
    symbol: symbol(feature)
  }
}

exports.graphicJSON = graphicJSON