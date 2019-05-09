var numberToHex = require('../../utils/color').numberToHex

/**
 * 
 * @param {Array} color [r, g, b, a]
 * @return {Object} { stroke(rrggbb), opacity([0,1]) }
 */
function colorArrToHexAndOpacity (color) {
  var r = numberToHex(color[0])
  var g = numberToHex(color[1])
  var b = numberToHex(color[2])
  var a = (color.length > 3 ? color[3] : 255) / 255
  return {
    hex: r + g + b,
    opacity: a
  }
}

exports.styleProperties = function (graphicJSON) {
  var geometry = graphicJSON.geometry
  var symbol = graphicJSON.symbol || {}
  var properties = {}

  if (geometry.rings) {
    var fso = colorArrToHexAndOpacity(symbol.color)
    var oso = colorArrToHexAndOpacity(symbol.outline.color)

    properties['fill'] = fso.hex
    properties['fill-opacity'] = fso.opacity

    properties['stroke'] = oso.hex
    properties['stroke-opacity'] = oso.opacity
    properties['stroke-width'] = symbol.outline.width
  } else if (geometry.paths) {
    var so = colorArrToHexAndOpacity(symbol.color)
    properties['stroke'] = so.hex
    properties['stroke-opacity'] = so.opacity
    properties['stroke-width'] = symbol.width
  } else {
    // not able to conver to point style in kml
  }

  return properties
}