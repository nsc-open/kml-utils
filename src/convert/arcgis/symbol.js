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
  r = parseInt(color.substr(1, 2), 16)
  g = parseInt(color.substr(3, 2), 16)
  b = parseInt(color.substr(5, 2), 16)
  a = opacity === undefined ? 255 : Math.round(opacity * 255)
  return [r, g, b, a]
}

function simpleLineSymbol (properties) {
  return {
    type: 'esriSLS',
    style: 'esriSLSSolid',
    color: properties['stroke'] ? rgba(properties['stroke'], properties['stroke-opacity']) : null,
    width: properties['stroke-width']
  }
}

function simpleFillSymbol (properties) {
  return {
    type: 'esriSFS',
    style: 'esriSFSSolid',
    color: properties['fill'] ? rgba(properties['fill'], properties['fill-opacity']) : null,
    outline: simpleLineSymbol(properties)
  }
}

function simpleMarkerSymbol (properties) {
  return {
    type: 'esriSMS',
    style: 'esriSMSCircle',
    color: [255, 255, 255, 64],
    size: 12,
    angle: 0,
    xoffset: 0,
    yoffset: 0,
    outline: {
      color: [255, 255, 255, 255],
      width: 1,
      style: 'esriSLSSolid',
      type: 'esriSLS'
    }
  }
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