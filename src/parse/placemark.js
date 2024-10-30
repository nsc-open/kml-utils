var FOLDER_KEY_NAME = require('../constants').FOLDER_KEY_NAME
var parseGeometry = require('./geometry').parse
var domUtils = require('../utils/dom')
var get = domUtils.get
var parent = domUtils.parent
var get1 = domUtils.get1
var nodeVal = domUtils.nodeVal
var attr = domUtils.attr

var isObj = function (a) {
  return Object.prototype.toString.call(a) === '[object Object]'
}

var $options = {}

function parse(root, stylePropertiesSetter, options) {
  if (options) $options = options
  var i, properties = {}
  var folder = options.folderElements.some(function (a) { return a === parent(root).tagName }) ? attr(parent(root), FOLDER_KEY_NAME) : null
  var key = options.folderElements.some(function (a) { return a === root.tagName }) ? attr(root, FOLDER_KEY_NAME) : null
  var name = nodeVal(get1(root, 'name'))
  var address = nodeVal(get1(root, 'address'))
  var description = nodeVal(get1(root, 'description'))
  var OvCoordType = nodeVal(get1(root, 'OvCoordType'))
  var timeSpan = get1(root, 'TimeSpan')
  var timeStamp = get1(root, 'TimeStamp')
  var extendedData = get1(root, 'ExtendedData')
  var visibility = get1(root, 'visibility')

  // parse extendedData first, so it could be overrided if name conflicts
  if (extendedData) {
    var datas = get(extendedData, 'Data')
    var simpleDatas = get(extendedData, 'SimpleData')

    for (i = 0; i < datas.length; i++) {
      properties[datas[i].getAttribute('name')] = nodeVal(get1(datas[i], 'value'))
    }
    for (i = 0; i < simpleDatas.length; i++) {
      properties[simpleDatas[i].getAttribute('name')] = nodeVal(simpleDatas[i])
    }
  }

  if (folder) {
    properties.folder = folder
    properties.parent = folder
  }
  if (key) {
    properties.key = key
  }
  if (name) {
    properties.name = name
  }
  if (address) {
    properties.address = address
  }
  if (description) {
    properties.description = description
  }
  if (OvCoordType) {
    properties.OvCoordType = OvCoordType
  }
  if (visibility) {
    properties.visibility = nodeVal(visibility)
  }
  if (timeStamp) {
    properties.timestamp = nodeVal(get1(timeStamp, 'when'))
  }
  if (timeSpan) {
    var begin = nodeVal(get1(timeSpan, 'begin'))
    var end = nodeVal(get1(timeSpan, 'end'))
    properties.timespan = { begin: begin, end: end }
  }

  if (stylePropertiesSetter) {
    stylePropertiesSetter(root, properties)
  }

  var callbacks = $options.propertyCallbacks
  if (isObj(callbacks)) {
    for (var key in callbacks) {
      if (!properties.hasOwnProperty(key)) continue
      var val = callbacks[key](properties[key])
      if (isObj(val)) {
        delete properties[key]
        Object.assign(properties, val)
      } else {
        properties[key] = callbacks[key](properties[key])
      }
    }
  }

  $options.attributes = properties
  var geomsAndTimes = parseGeometry(root, $options)

  if (!geomsAndTimes.geoms.length) {
    return null
  }

  if (geomsAndTimes.coordTimes.length) {
    properties.coordTimes = (geomsAndTimes.coordTimes.length === 1)
      ? geomsAndTimes.coordTimes[0]
      : geomsAndTimes.coordTimes
  }

  var feature = {
    type: 'Feature',
    geometry: (geomsAndTimes.geoms.length === 1)
      ? geomsAndTimes.geoms[0]
      : {
        type: 'GeometryCollection',
        geometries: geomsAndTimes.geoms
      },
    properties: properties
  }
  if (attr(root, 'id')) {
    feature.id = attr(root, 'id')
  }
  return feature
}

exports.parse = parse