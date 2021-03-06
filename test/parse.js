var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse
var arcgisConvertor = require('../src/index').arcgisConvertor
var parseDescription = require('../src/index').parseDescription

var kmlDom = new DOMParser().parseFromString(fs.readFileSync('./kmls/HOUSE_single_graphic_multi_linestrings.kml', 'utf8'))
var r = parse(kmlDom, { 
  style: true, 
  propertyCallbacks: {
    description(data){
      return parseDescription(data)
    }
  },
  coordCallback(coord){
    return coord.map(a => a+1000)
  },
})

r.graphicJSON = r.geoJSON.features.map(f => {
  console.log('-', f.properties)
  return arcgisConvertor.graphicJSON(f)
})


fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), JSON.stringify(r.graphicJSON))