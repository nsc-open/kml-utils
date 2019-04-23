
var serializer
if (typeof XMLSerializer !== 'undefined') {
  /* istanbul ignore next */
  serializer = new XMLSerializer()
} else {
  var isNodeEnv = (typeof process === 'object' && !process.browser)
  var isTitaniumEnv = (typeof Titanium === 'object')
  if (typeof exports === 'object' && (isNodeEnv || isTitaniumEnv)) {
    serializer = new (require('xmldom').XMLSerializer)()
  } else {
    throw new Error('Unable to initialize serializer')
  }
}

exports.xml2str = function (str) {
  // IE9 will create a new XMLSerializer but it'll crash immediately.
  // This line is ignored because we don't run coverage tests in IE9
  /* istanbul ignore next */
  if (str.xml !== undefined) return str.xml
  return serializer.serializeToString(str)
}

exports.parent = function (el) {
  return el.parentElement || el.parentNode || null
}

exports.get = function (doc, tag) {
  return doc.getElementsByTagName(tag)
}

exports.get1 = function (doc, tag) {
  const els = exports.get(doc, tag)
  return els.length ? els[0] : null
}

exports.attr = function (el, name) {
  return el.getAttribute(name)
}

exports.setAttr = function (el, name, value) {
  return el.setAttribute(name, value)
}

exports.attrf = function (el, name) {
  return parseFloat(exports.attr(el, name))
}

exports.norm = function (el) {
  return el.normalize ? el.normalize() : el
}

exports.nodeVal = function (el) {
  if (el) { exports.norm(el) }
  return (el && el.textContent) || ''
}

// cast array x into numbers
exports.numarray = function (x) {
  for (var j = 0, o = []; j < x.length; j++) {
    o[j] = parseFloat(x[j])
  }
  return o
}

// generate a short, numeric hash of a string
exports.okhash = function (x) {
  if (!x || !x.length) {
    return 0
  }
  for (var i = 0, h = 0; i < x.length; i++) {
    h = ((h << 5) - h) + x.charCodeAt(i) | 0
  }
  return h
}

exports.kmlColor = function (v) {
  var color, opacity
  v = v || ''
  if (v.substr(0, 1) === '#') {
    v = v.substr(1)
  }
  if (v.length === 6 || v.length === 3) {
    color = v
  }
  if (v.length === 8) {
    opacity = parseInt(v.substr(0, 2), 16) / 255
    color = '#' + v.substr(6, 2) + v.substr(4, 2) + v.substr(2, 2)
  }
  return [color, isNaN(opacity) ? undefined : opacity]
}

// get one coordinate from a coordinate array, if any
var removeSpace = /\s*/g
exports.coord1 = function (v) {
  return exports.numarray(v.replace(removeSpace, '').split(','))
}

// get all coordinates from a coordinate array as [[],[]]
var trimSpace = /^\s*|\s*$/g
var splitSpace = /\s+/
exports.coord = function (v) {
  var coords = v.replace(trimSpace, '').split(splitSpace)
  var o = []
  for (var i = 0; i < coords.length; i++) {
    o.push(exports.coord1(coords[i]))
  }
  return o
}

exports.gxCoord = function (v) {
  return exports.numarray(v.split(' '))
}

exports.gxCoords = function (root) {
  var get = exports.get
  var gxCoord = exports.gxCoord
  var nodeVal = exports.nodeVal
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