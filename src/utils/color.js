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
  kmlColor: kmlColor
}