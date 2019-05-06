var strxml = require('strxml')
var colorUtils = require('../utils/color')
var geoUtils = require('../utils/geometry')
var styleUtils = require('../utils/style')
var tag = strxml.tag
var encode = strxml.encode

module.exports = function tokml (geojson, options) {
  options = options || {
    documentName: undefined,
    documentDescription: undefined,
    name: 'name',
    description: 'description',
    simplestyle: false,
    timestamp: 'timestamp'
  }

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    tag('kml',
      tag('Document',
        documentName(options) +
        documentDescription(options) +
        root(geojson, options)
      ),
      [['xmlns', 'http://www.opengis.net/kml/2.2']]
    )
}

function root (_, options) {
  if (!_.type) {
    return ''
  }
  var styleHashesArray = []
            
  switch (_.type) {
    case 'FeatureCollection':
      if (!_.features) {
        return ''
      }
      return _.features.map(feature(options, styleHashesArray)).join('')
    case 'Feature':
      return feature(options, styleHashesArray)(_)
    default:
      return feature(options, styleHashesArray)({
        type: 'Feature',
        geometry: _,
        properties: {}
      })
  }
}

function documentName (options) {
  return (options.documentName !== undefined) ? tag('name', options.documentName) : ''
}

function documentDescription (options) {
  return (options.documentDescription !== undefined) ? tag('description', options.documentDescription) : ''
}

function name (_, options) {
  return _[options.name] ? tag('name', encode(_[options.name])) : ''
}

function description(_, options) {
  return _[options.description] ? tag('description', encode(_[options.description])) : ''
}

function timestamp (_, options) {
  return _[options.timestamp] ? tag('TimeStamp', tag('when', encode(_[options.timestamp]))) : ''
}

function feature (options, styleHashesArray) {
  return function(_) {
    if (!_.properties || !geoUtils.valid(_.geometry)) {
      return ''
    }
    var geometryString = geoUtils.any(_.geometry)
    if (!geometryString) {
      return ''
    }
      
    var styleDefinition = ''
    var styleReference = ''
    if (options.simplestyle) {
      var styleHash = styleUtils.hashStyle(_.properties)
      if (styleHash) {
        if (geoUtils.isPoint(_.geometry) && styleUtils.hasMarkerStyle(_.properties)) {
          if (styleHashesArray.indexOf(styleHash) === -1) {
            styleDefinition = markerStyle(_.properties, styleHash)
            styleHashesArray.push(styleHash)
          }
          styleReference = tag('styleUrl', '#' + styleHash);
        } else if ((geoUtils.isPolygon(_.geometry) || geoUtils.isLine(_.geometry)) && 
          styleUtils.hasPolygonAndLineStyle(_.properties)) {
          if (styleHashesArray.indexOf(styleHash) === -1) {
            styleDefinition = polygonAndLineStyle(_.properties, styleHash)
            styleHashesArray.push(styleHash)
          }
          styleReference = tag('styleUrl', '#' + styleHash)
        }
        // Note that style of GeometryCollection / MultiGeometry is not supported
      }
    }
      
    return styleDefinition + tag('Placemark',
      name(_.properties, options) +
      description(_.properties, options) +
      extendeddata(_.properties) +
      timestamp(_.properties, options) +
      geometryString +
      styleReference
    )
  }
}

function linearring (_) {
  return _.map(function (cds) { return cds.join(',') }).join(' ')
}

// ## Data
function extendeddata (_) {
  return tag('ExtendedData', pairs(_).map(data).join(''))
}

function data (_) {
  return tag('Data', tag('value', encode(_[1])), [['name', encode(_[0])]])
}

// ## Marker style
function markerStyle (_, styleHash) {
  return tag('Style',
    tag('IconStyle',
      tag('Icon',
        tag('href', styleUtils.iconUrl(_))
      )
    ) + iconSize(_), [['id', styleHash]]
  )
}

function iconSize (_) {
  return tag('hotSpot', '', [
    ['xunits', 'fraction'],
    ['yunits', 'fraction'],
    ['x', 0.5],
    ['y', 0.5]
  ])
}

// ## Polygon and Line style
function polygonAndLineStyle(_, styleHash) {
  var lineStyle = tag('LineStyle', [
    tag('color', colorUtils.hexToKmlColor(_['stroke'], _['stroke-opacity']) || 'ff555555') +
    tag('width', _['stroke-width'] === undefined ? 2 : _['stroke-width'])
  ])
    
  var polyStyle = ''
    
  if (_['fill'] || _['fill-opacity']) {
    polyStyle = tag('PolyStyle', [
      tag('color', colorUtils.hexToKmlColor(_['fill'], _['fill-opacity']) || '88555555')
    ])
  }
    
  return tag('Style', lineStyle + polyStyle, [['id', styleHash]])
}

// ## General helpers
function pairs (_) {
  var o = []
  for (var i in _) {
    o.push([i, _[i]])
  }
  return o
}

// ## Geometry Types
//
// https://developers.google.com/kml/documentation/kmlreference#geometry
var GeometryTypes = {
  Point: function (_) {
    return tag('Point', tag('coordinates', _.coordinates.join(',')))
  },
  LineString: function (_) {
    return tag('LineString', tag('coordinates', linearring(_.coordinates)))
  },
  Polygon: function (_) {
    if (!_.coordinates.length) {
      return ''
    }
    var outer = _.coordinates[0]
    var inner = _.coordinates.slice(1)
    var outerRing = tag('outerBoundaryIs', tag('LinearRing', tag('coordinates', linearring(outer))))
    var innerRings = inner.map(function (i) {
      return tag('innerBoundaryIs',
        tag('LinearRing', tag('coordinates', linearring(i)))
      )
    }).join('')
    return tag('Polygon', outerRing + innerRings)
  },
  MultiPoint: function (_) {
    if (!_.coordinates.length) {
      return ''
    }
    return tag('MultiGeometry', _.coordinates.map(function (c) {
      return GeometryTypes.Point({ coordinates: c })
    }).join(''))
  },
  MultiPolygon: function (_) {
    if (!_.coordinates.length) {
      return ''
    }
    return tag('MultiGeometry', _.coordinates.map(function (c) {
      return GeometryTypes.Polygon({ coordinates: c })
    }).join(''))
  },
  MultiLineString: function (_) {
    if (!_.coordinates.length) {
      return ''
    }
    return tag('MultiGeometry', _.coordinates.map(function (c) {
      return GeometryTypes.LineString({ coordinates: c })
    }).join(''))
  },
  GeometryCollection: function (_) {
    return tag('MultiGeometry', _.geometries.map(geoUtils.any).join(''))
  }
}