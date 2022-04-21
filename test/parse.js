var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse
var arcgisConvertor = require('../src/index').arcgisConvertor
var parseDescription = require('../src/index').parseDescription

var filePath = path.join(__dirname, './kmls/folders-demo.kml')
var kmlDom = new DOMParser().parseFromString(fs.readFileSync(filePath, 'utf8'))
var r = parse(kmlDom, { 
  style: true, 
  folderElementNames: ['Document', 'Folder'],
  propertyCallbacks: {
    description(data){
      return parseDescription(data)
    }
  },
  coordCallback(coord, attributes){
    return coord.map(a => a+1000)
  },
})

r.graphicJSON = r.geoJSON.features.map(f => {
  // console.log('-', f.properties)
  return arcgisConvertor.graphicJSON(f, { 
    geometryCollection: {
      mergePoint: true,
      mergePolyline: true,
      mergePolygon: true,
    }
  })
})
.flat()


fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), JSON.stringify(r.graphicJSON))