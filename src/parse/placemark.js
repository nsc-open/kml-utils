var FOLDER_KEY_NAME = require('../constants').FOLDER_KEY_NAME
var getGeometry = require('./geometry').getGeometry
var u = require('../utils')
var get = u.get
var parent = u.parent
var get1 = u.get1
var nodeVal = u.nodeVal
var attr = u.attr
var kmlColor = u.kmlColor


function getPlacemark (root, styleIndex, styleMapIndex, styleByHash) {
  var i, properties = {}
  var geomsAndTimes = getGeometry(root)
  var folder = parent(root).tagName === 'Folder' ? attr(parent(root), FOLDER_KEY_NAME) : null
  var name = nodeVal(get1(root, 'name'))
  var address = nodeVal(get1(root, 'address'))
	var styleUrl = nodeVal(get1(root, 'styleUrl'))
  var description = nodeVal(get1(root, 'description'))
  var timeSpan = get1(root, 'TimeSpan')
  var timeStamp = get1(root, 'TimeStamp')
  var extendedData = get1(root, 'ExtendedData')
  var lineStyle = get1(root, 'LineStyle')
  var polyStyle = get1(root, 'PolyStyle')
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
	
	// styles
  if (styleUrl) {
    if (styleUrl[0] !== '#') {
      styleUrl = '#' + styleUrl
    }

    properties.styleUrl = styleUrl
    if (styleIndex[styleUrl]) {
      properties.styleHash = styleIndex[styleUrl]
    }
    if (styleMapIndex[styleUrl]) {
      properties.styleMapHash = styleMapIndex[styleUrl]
      properties.styleHash = styleIndex[styleMapIndex[styleUrl].normal]
		}

    // Try to populate the lineStyle or polyStyle since we got the style hash
    var style = styleByHash[properties.styleHash];
    if (style) {
      if (!lineStyle) {
				lineStyle = get1(style, 'LineStyle')
			}
      if (!polyStyle) {
				polyStyle = get1(style, 'PolyStyle')
			}
      var iconStyle = get1(style, 'IconStyle')
      if (iconStyle) {
      	var icon = get1(iconStyle, 'Icon')
        if (icon) {
        	var href = nodeVal(get1(icon, 'href'))
          if (href) {
						properties.icon = href
					}
        }
      }
    }
	}
  if (lineStyle) {
    var linestyles = kmlColor(nodeVal(get1(lineStyle, 'color')))
    var color = linestyles[0]
    var opacity = linestyles[1]
    var width = parseFloat(nodeVal(get1(lineStyle, 'width')))
    if (color) properties.stroke = color
    if (!isNaN(opacity)) properties['stroke-opacity'] = opacity
    if (!isNaN(width)) properties['stroke-width'] = width
  }
  if (polyStyle) {
    var polystyles = kmlColor(nodeVal(get1(polyStyle, 'color')))
    var pcolor = polystyles[0]
    var popacity = polystyles[1]
    var fill = nodeVal(get1(polyStyle, 'fill'))
  	var outline = nodeVal(get1(polyStyle, 'outline'))
    if (pcolor) properties.fill = pcolor
    if (!isNaN(popacity)) properties['fill-opacity'] = popacity
    if (fill) properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0
    if (outline) properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0
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
  return [feature]
}

exports.getPlacemark = getPlacemark