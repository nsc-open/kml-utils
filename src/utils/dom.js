'use strict'

function xml2str (el) {
  return el? el.innerHTML: null
}

function parent (el) {
  return el? el.parent: null
}

function get (doc, tag) {
  return doc? doc.selectAllDeep(tag): null
}

function get1 (doc, tag) {
  return doc? doc.selectOneDeep(tag): null
}

function getChild (doc, tag) {
  return doc? doc.selectAll(tag): null
}

function getChild1 (doc, tag) {
  return doc? doc.selectOne(tag): null
}

function attr (el, name) {
  return el? el.attributes[name]: null
}

function setAttr (el, name, value) {
  return el? (el.attributes[name] = value): null
}

function attrf (el, name) {
  return parseFloat(attr(el, name))
}

function norm (el) {
  return el? el.innerHTML: null
}

function nodeVal (el, trim) {
  return norm(el)
}

module.exports = {
  parent: parent,
  get: get,
  get1: get1,
  attr: attr,
  setAttr: setAttr,
  attrf: attrf,
  norm: norm,
  nodeVal: nodeVal,
  xml2str: xml2str,
  getChild: getChild,
  getChild1: getChild1
}