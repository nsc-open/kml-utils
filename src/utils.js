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