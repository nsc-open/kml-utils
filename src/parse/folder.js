var FOLDER_KEY_NAME = require('../constants').FOLDER_KEY_NAME
var u = require('../utils')
var parent = u.parent
var nodeVal = u.nodeVal
var get = u.get
var get1 = u.get1
var attr = u.attr
var setAttr = u.setAttr

/**
 * returns folder tree: [{ key, parent, name, children }]
 * and set Folder element with key attribute
 */
function parse (kmlDocument, options) {
  var folderEls = Array.from(get(kmlDocument, 'Folder'))
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
      parent: parentEl.tagName === 'Folder' ? attr(parentEl, FOLDER_KEY_NAME) : null,
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