var FOLDER_KEY_NAME = require('../constants').FOLDER_KEY_NAME
var domUtils = require('../utils/dom')
var parent = domUtils.parent
var nodeVal = domUtils.nodeVal
var get = domUtils.get
var get1 = domUtils.get1
var attr = domUtils.attr
var setAttr = domUtils.setAttr

/**
 * returns folder tree: [{ key, parent, name, children }]
 * and set Folder element with key attribute
 */
function parse (kmlDocument, options) {
  var folderEls = []
  options.folderElements.forEach(function (a) {
    folderEls = folderEls.concat(Array.from(get(kmlDocument, a)))
  })

  if (folderEls.length === 0) {
    return []
  }

  var defaultFolderName = (options && options.defaultFolderName) ? options.defaultFolderName : 'unknown'
  var parentEl = parent(folderEls[0])

  var n = 0
  var process = function (folderEl) {
    var parentEl = parent(folderEl)
    var nameEl = get1(folderEl, 'name')

    var key = (n++) + ''
    setAttr(folderEl, FOLDER_KEY_NAME, key)

    return {
      key: key,
      parent: options.folderElements.some(function(a){ return a === parentEl.tagName }) ? attr(parentEl, FOLDER_KEY_NAME) : null,
      name: nameEl ? nodeVal(nameEl) : defaultFolderName,
      children: folderEls.filter(function (e) {
        return parent(e) === folderEl
      }).map(process)
    }
  }

  return folderEls.filter(function (e) {
    return parent(e) === parentEl
  }).map(process)
}

exports.parse = parse