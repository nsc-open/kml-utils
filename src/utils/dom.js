var serializer = new (require('xmldom').XMLSerializer)()

function xml2str (str) {
  // IE9 will create a new XMLSerializer but it'll crash immediately.
  // This line is ignored because we don't run coverage tests in IE9
  /* istanbul ignore next */
  if (str.xml !== undefined) return str.xml
  return serializer.serializeToString(str)
}

function parent (el) {
  return el.parentElement || el.parentNode || null
}

function get (doc, tag) {
  return doc.getElementsByTagName(tag)
}

function get1 (doc, tag) {
  var els = get(doc, tag)
  return els.length ? els[0] : null
}

function getChild(doc, tag) {
  var list = []
  if (!doc || !doc.childNodes.length) {
    return list
  }
  
  for(var i = 0; i < doc.childNodes.length; i++) {
    var el = doc.childNodes[i]
    if (el.tagName === tag) {
      list.push(el)
    }
  }
  return list
}

function getChild1(doc, tag) {
  if (!doc || !doc.childNodes.length) {
    return null
  }
  for(var i = 0; i < doc.childNodes.length; i++) {
    var el = doc.childNodes[i]
    if (el.tagName === tag) {
      return el
    }
  }
  return null
}

function attr (el, name) {
  return el.getAttribute(name)
}

function setAttr (el, name, value) {
  return el.setAttribute(name, value)
}

function attrf (el, name) {
  return parseFloat(attr(el, name))
}

function norm (el) {
  return el.normalize ? el.normalize() : el
}

function nodeVal (el, trim) {
  if (el) { norm(el) }
  var value = (el && el.textContent) || ''
  trim = trim === undefined ? true : trim // trim line breaks and spaces
  return trim ? value.replace(/(\r\n|\n|\r)/gm, "").trim() : value
}

module.exports = {
  parent: parent,
  get: get,
  get1: get1,
  getChild: getChild,
  getChild1: getChild1,
  attr: attr,
  setAttr: setAttr,
  attrf: attrf,
  norm: norm,
  nodeVal: nodeVal,
  xml2str: xml2str
}