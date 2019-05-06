var FOLDER_KEY_NAME = require('../constants').FOLDER_KEY_NAME
var parseGeometry = require('./geometry').parse
var domUtils = require('../utils/dom')
var get = domUtils.get
var parent = domUtils.parent
var get1 = domUtils.get1
var nodeVal = domUtils.nodeVal
var attr = domUtils.attr

function parse (root, stylePropertiesSetter) {
  var i, properties = {}
  var geomsAndTimes = parseGeometry(root)
  var folder = parent(root).tagName === 'Folder' ? attr(parent(root), FOLDER_KEY_NAME) : null
  var name = nodeVal(get1(root, 'name'))
  var address = nodeVal(get1(root, 'address'))
	var description = nodeVal(get1(root, 'description'))
  var timeSpan = get1(root, 'TimeSpan')
  var timeStamp = get1(root, 'TimeStamp')
  var extendedData = get1(root, 'ExtendedData')
  var visibility = get1(root, 'visibility')

  if (!geomsAndTimes.geoms.length) {
		return []
	}
  if (folder) {
		properties.folder = folder
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
	if (geomsAndTimes.coordTimes.length) {
		properties.coordTimes = (geomsAndTimes.coordTimes.length === 1)
			? geomsAndTimes.coordTimes[0]
			: geomsAndTimes.coordTimes
	}
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
  
  if (stylePropertiesSetter) {
    stylePropertiesSetter(root, properties)
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