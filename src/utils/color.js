/**
 * 
 * @param {Number} n
 * @param {Number} topValue 1 or 255, default is 255
 * @return 2 digits hex value in lowercase like, ff
 */
function numberToHex (n, topValue) {
  var hex
  topValue = topValue || 255
  if (topValue === 1) {
    n *= 255
  }
  n = Math.min(n, 255)
  hex = n.toString(16)

  if (hex.indexOf('.') > -1) {
    hex = hex.substr(0, hex.indexOf('.'))
  }
  if (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}

/**
 * convert hex to kml color value
 * @param {String} hexColor format like: FFF/FFFFFF/#FFF/#FFFFFF
 * @param {Number} opacity [0, 1]
 * @return {String} aabbggrr (lowercase)
 */
function hexToKmlColor (hexColor, opacity) {
  if (typeof hexColor !== 'string') {
    return ''
  }
  
  hexColor = hexColor.replace('#', '').toLowerCase()
  
  if (hexColor.length === 3) {
    hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2]
  } else if (hexColor.length !== 6) {
    return ''
  }
  
  var r = hexColor[0] + hexColor[1]
  var g = hexColor[2] + hexColor[3]
  var b = hexColor[4] + hexColor[5]
  
  var o = 'ff'
  if (typeof opacity === 'number' && opacity >= 0.0 && opacity <= 1.0) {
    o = (opacity * 255).toString(16)
    if (o.indexOf('.') > -1) {
      o = o.substr(0, o.indexOf('.'))
    }
    if (o.length < 2) {
      o = '0' + o
    }
  }
  
  return o + b + g + r
}

/**
 * parse kml color value
 * @param {String} v acceptable formats: rgb/#rgb/rrggbb/#rrggbb/aabbggrr
 * @return [hexColorString(#rrggbb), opacity([0,1])]
 */
function kmlColor (v) {
  var color, opacity
  v = v || ''
  if (v.substr(0, 1) === '#') {
    v = v.substr(1)
  }
  if (v.length === 6 || v.length === 3) { // rrggbb || rgb
    color = v
  }
  if (v.length === 8) { // aabbggrr https://developers.google.com/kml/documentation/kmlreference#colorstyle
    opacity = parseInt(v.substr(0, 2), 16) / 255 // [0, 1]
    color = '#' + v.substr(6, 2) + v.substr(4, 2) + v.substr(2, 2) // #rrggbb
  }
  return [color, isNaN(opacity) ? undefined : opacity]
}

module.exports = {
  hexToKmlColor: hexToKmlColor,
  kmlColor: kmlColor,
  numberToHex: numberToHex
}