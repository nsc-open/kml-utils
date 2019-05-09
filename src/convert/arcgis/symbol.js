var DEFAULT_SYMBOLS = require('../../constants')

/**
 * 
 * @param {String} color rgb/#rgb/rrggbb/#rrggbb
 * @param {Number} opacity [0, 1]
 */
function rgba (color, opacity) {
  var r, g, b, a
  if (color[0] === '#') { // #rrggbb
    color = color.substr(1)
  }
  if (color.length === 3) { // rgb
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
  }
  if (color.length === 6) { // rrggbb
    // do nothing
  }
  r = parseInt(color.substr(0, 2), 16)
  g = parseInt(color.substr(2, 2), 16)
  b = parseInt(color.substr(4, 2), 16)
  a = opacity === undefined ? 255 : Math.round(opacity * 255)
  return [r, g, b, a]
}

function simpleLineSymbol (properties) {
  return {
    type: 'esriSLS',
    style: 'esriSLSSolid',
    color: properties['stroke'] ? rgba(properties['stroke'], properties['stroke-opacity']) : DEFAULT_SYMBOLS.polyline.color,
    width: properties['stroke-width'] || DEFAULT_SYMBOLS.polyline.width
  }
}

function simpleFillSymbol (properties) {
  return {
    type: 'esriSFS',
    style: 'esriSFSSolid',
    color: properties['fill'] ? rgba(properties['fill'], properties['fill-opacity']) : DEFAULT_SYMBOLS.polygon.color,
    outline: simpleLineSymbol(properties)
  }
}

/**
 * there is no symbol styles mapping from kml point to arcgis symbol,
 * so here we just returns a default marker symbol
 */
function simpleMarkerSymbol (properties) {
  return DEFAULT_SYMBOLS.marker
}

exports.symbol = function (feature) {
  var geoType = feature.geometry.type === 'GeometryCollection' ? feature.geometry.geometries[0].type : feature.geometry.type
  if (geoType === 'LineString') {
    return simpleLineSymbol(feature.properties)
  } else if (geoType === 'Polygon') {
    return simpleFillSymbol(feature.properties)
  } else if (geoType === 'Point') {
    return simpleMarkerSymbol(feature.properties)
  }
}