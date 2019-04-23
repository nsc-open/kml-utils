var u = require('../utils')
var get = u.get
var get1 = u.get1
var attr = u.attr
var nodeVal = u.nodeVal
var okhash = u.okhash
var xml2str = u.xml2str
var kmlColor = u.kmlColor

exports.parse = parse

function parse (doc, options) {
	// styleIndex keeps track of hashed styles in order to match features
  var styleIndex = {} // { '#styleId': <hashValue> }
  var styleByHash = {}
  // styleMapIndex keeps track of style maps to expose in properties
  var styleMapIndex = {}
  
  var styles = get(doc, 'Style')
  var styleMaps = get(doc, 'StyleMap')

  for (var k = 0; k < styles.length; k++) {
    var hash = okhash(xml2str(styles[k])).toString(16)
    styleIndex['#' + attr(styles[k], 'id')] = hash
    styleByHash[hash] = styles[k]
  }
  for (var l = 0; l < styleMaps.length; l++) {
    styleIndex['#' + attr(styleMaps[l], 'id')] = okhash(xml2str(styleMaps[l])).toString(16)
    var pairs = get(styleMaps[l], 'Pair')
    var pairsMap = {}
    for (var m = 0; m < pairs.length; m++) {
      pairsMap[nodeVal(get1(pairs[m], 'key'))] = nodeVal(get1(pairs[m], 'styleUrl'))
    }
    styleMapIndex['#' + attr(styleMaps[l], 'id')] = pairsMap
  }
	
	if (options && options.returnPropertiesSetter) {
		return function (placemarkNode, properties) {
			setStyleProperties(placemarkNode, properties, styleByHash, styleIndex, styleMapIndex)
		}
	} else {
		return { styleByHash, styleIndex, styleMapIndex }
	}
}

function setStyleProperties (placemarkNode, properties, styleByHash, styleIndex, styleMapIndex) {
	var styleUrl = nodeVal(get1(placemarkNode, 'styleUrl'))
	var lineStyle = get1(placemarkNode, 'LineStyle')
	var polyStyle = get1(placemarkNode, 'PolyStyle')
	var iconStyle = null

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
    var style = styleByHash[properties.styleHash]
    if (style) {
			iconStyle = get1(style, 'IconStyle')
			lineStyle = lineStyle || get1(style, 'LineStyle')
			polyStyle = polyStyle || get1(style, 'PolyStyle')
    }
	}

	if (iconStyle) {
		setPointStyleProperties(properties, iconStyle)
	}
	if (lineStyle) {
		setLineStyleProperties(properties, lineStyle)
	}
	if (polyStyle) {
		setPolygonStyleProperties(properties, polyStyle)
	}
}

/**
 * point style fields: { icon: <icon url> }
 * about IconStyle: https://developers.google.com/kml/documentation/kmlreference#iconstyle
 */
function setPointStyleProperties (properties, style) {
	var icon = get1(style, 'Icon')
  if (icon) {
    var href = nodeVal(get1(icon, 'href'))
    if (href) {
			properties['icon'] = href
		}
  }
}

/**
 * polyline style fields: { 'stroke', 'stroke-opacity', 'stroke-width' }
 * about LineStyle: https://developers.google.com/kml/documentation/kmlreference#linestyle
 */
function setLineStyleProperties (properties, style) {
	var linestyles = kmlColor(nodeVal(get1(style, 'color')))
  var color = linestyles[0]
  var opacity = linestyles[1]
	var width = parseFloat(nodeVal(get1(style, 'width')))

  if (color) {
		properties['stroke'] = color
	}
  if (!isNaN(opacity)) {
		properties['stroke-opacity'] = opacity
	}
  if (!isNaN(width)) {
		properties['stroke-width'] = width
	}
}

/**
 * polygon style fields: { 'fill', 'fill-opacity', 'stroke-opacity' }
 * about PolyStyle: https://developers.google.com/kml/documentation/kmlreference#polystyle
 */
function setPolygonStyleProperties (properties, style) {
  var polystyles = kmlColor(nodeVal(get1(style, 'color')))
  var color = polystyles[0]
  var opacity = polystyles[1]
  var fill = nodeVal(get1(style, 'fill'))
	var outline = nodeVal(get1(style, 'outline'))

  if (color) {
    properties['fill'] = color
  }
  if (!isNaN(opacity)) {
		properties['fill-opacity'] = opacity
	}
  if (fill) {
		properties['fill-opacity'] = fill === '1' ? properties['fill-opacity'] || 1 : 0
	}
  if (outline) {
		properties['stroke-opacity'] = outline === '1' ? properties['stroke-opacity'] || 1 : 0
	}
}