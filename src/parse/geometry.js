var domUtils = require('../utils/dom')
var get = domUtils.get
var get1 = domUtils.get1
var nodeVal = domUtils.nodeVal

var geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track']

var $options = {}

function parse (root, options) {
  if(options) $options = options
  var geomNode, geomNodes, i, j, k, geoms = [], coordTimes = []

  if (get1(root, 'MultiGeometry')) {
    return parse(get1(root, 'MultiGeometry'))
  }
  if (get1(root, 'MultiTrack')) {
    return parse(get1(root, 'MultiTrack'))
  }
  if (get1(root, 'gx:MultiTrack')) {
    return parse(get1(root, 'gx:MultiTrack'))
  }

  for (i = 0; i < geotypes.length; i++) {
    geomNodes = get(root, geotypes[i])
    if (geomNodes) {
      for (j = 0; j < geomNodes.length; j++) {
        geomNode = geomNodes[j]
        if (geotypes[i] === 'Point') {
          geoms.push({
            type: 'Point',
            coordinates: coord1(nodeVal(get1(geomNode, 'coordinates'), false))
          })
        } else if (geotypes[i] === 'LineString') {
          geoms.push({
            type: 'LineString',
            coordinates: coord(nodeVal(get1(geomNode, 'coordinates'), false))
          })
        } else if (geotypes[i] === 'Polygon') {
          var rings = get(geomNode, 'LinearRing'), coords = []
          for (k = 0; k < rings.length; k++) {
            coords.push(coord(nodeVal(get1(rings[k], 'coordinates'), false)));
          }
          geoms.push({
            type: 'Polygon',
            coordinates: coords
          })
        } else if (geotypes[i] === 'Track' || geotypes[i] === 'gx:Track') {
          var track = gxCoords(geomNode)
          geoms.push({
            type: 'LineString',
            coordinates: track.coords
          })
          if (track.times.length) {
            coordTimes.push(track.times)
          }
        }
      }
    }
  }
  return {
    geoms: geoms,
    coordTimes: coordTimes
  }
}

// cast array x into numbers
function numarray (x) {
  for (var j = 0, o = []; j < x.length; j++) {
    o[j] = parseFloat(x[j])
  }
  return o
}

// get one coordinate from a coordinate array, if any
var removeSpace = /\s*/g
var trimSpace = /^\s*|\s*$/g
var splitSpace = /\s+/

function coord1 (v) {
  var cord = numarray(v.replace(removeSpace, '').split(','))
  if($options.coordCallback) cord = $options.coordCallback(cord)
  return cord
}

// get all coordinates from a coordinate array as [[],[]]
function coord (v) {
  var coords = v.replace(trimSpace, '').split(splitSpace)
  var o = []
  for (var i = 0; i < coords.length; i++) {
    o.push(coord1(coords[i]))
  }
  return o
}

function gxCoord (v) {
  return numarray(v.split(' '))
}

function gxCoords (root) {
  var elems = get(root, 'coord', 'gx'), coords = [], times = []

  if (elems.length === 0) {
    elems = get(root, 'gx:coord')
  }

  for (var i = 0; i < elems.length; i++) {
    coords.push(gxCoord(nodeVal(elems[i])))
  }

  var timeElems = get(root, 'when')
  for (var j = 0; j < timeElems.length; j++) {
    times.push(nodeVal(timeElems[j]))
  }

  return {
    coords: coords,
    times: times
  }
}

exports.parse = parse