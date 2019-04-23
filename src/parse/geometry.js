var u = require('../utils')
var get = u.get
var get1 = u.get1
var nodeVal = u.nodeVal
var coord1 = u.coord1
var coord = u.coord
var gxCoords = u.gxCoords

var geotypes = ['Polygon', 'LineString', 'Point', 'Track', 'gx:Track']

function parse (root) {
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
            coordinates: coord1(nodeVal(get1(geomNode, 'coordinates')))
          })
        } else if (geotypes[i] === 'LineString') {
          geoms.push({
            type: 'LineString',
            coordinates: coord(nodeVal(get1(geomNode, 'coordinates')))
          })
        } else if (geotypes[i] === 'Polygon') {
          var rings = get(geomNode, 'LinearRing'), coords = []
          for (k = 0; k < rings.length; k++) {
            coords.push(coord(nodeVal(get1(rings[k], 'coordinates'))));
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

exports.parse = parse