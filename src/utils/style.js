function hasPolygonAndLineStyle (_) {
  var styleFields = {
    'stroke': true,
    'stroke-opacity': true,
    'stroke-width': true,
    'fill': true,
    'fill-opacity': true
  }
  for (var key in _) {
    if (styleFields[key]) {
      return true
    }
  }
}

function hashStyle (_) {
  var hash = ''
  
  if (_['marker-symbol']) {
    hash = hash + 'ms' + _['marker-symbol']
  }
  if (_['marker-color']) {
    hash = hash + 'mc' + _['marker-color'].replace('#', '')
  }
  if (_['marker-size']) {
    hash = hash + 'ms' + _['marker-size']
  }
  if (_['stroke']) {
    hash = hash + 's' + _['stroke'].replace('#', '')
  }
  if (_['stroke-width']) {
    hash = hash + 'sw' + _['stroke-width'].toString().replace('.', '')
  }
  if (_['stroke-opacity']) {
    hash = hash + 'mo' + _['stroke-opacity'].toString().replace('.', '')
  }
  if (_['fill']) {
    hash = hash + 'f' + _['fill'].replace('#', '')
  }
  if (_['fill-opacity']) {
    hash = hash + 'fo' + _['fill-opacity'].toString().replace('.', '')
  }
  
  return hash
}

function hasMarkerStyle (_) {
  return !!(_['marker-size'] || _['marker-symbol'] || _['marker-color'])
}

function iconUrl (_) {
  var size = _['marker-size'] || 'medium'
  var symbol = _['marker-symbol'] ? '-' + _['marker-symbol'] : ''
  var color = (_['marker-color'] || '7e7e7e').replace('#', '')
  return 'https://api.tiles.mapbox.com/v3/marker/' + 'pin-' + size.charAt(0) + symbol + '+' + color + '.png'
}

module.exports = {
  hasPolygonAndLineStyle: hasPolygonAndLineStyle,
  hashStyle: hashStyle,
  hasMarkerStyle: hasMarkerStyle,
  iconUrl: iconUrl
}