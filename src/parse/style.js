var u = require('../utils')
var get = u.get
var get1 = u.get1
var attr = u.attr
var nodeVal = u.nodeVal
var okhash = u.okhash
var xml2str = u.xml2str

exports.parse = doc => {
  // styleindex keeps track of hashed styles in order to match features
  var styleIndex = {} // { '#styleId': <hashValue> }
  var styleByHash = {}
  // stylemapindex keeps track of style maps to expose in properties
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

  return {
    styleIndex,
    styleByHash,
    styleMapIndex
  }
}

