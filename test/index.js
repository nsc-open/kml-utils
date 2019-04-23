var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse

var kmlDom = new DOMParser().parseFromString(fs.readFileSync('demo.kml', 'utf8'))
var json = JSON.stringify(parse(kmlDom, { style: true }))

fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), json)