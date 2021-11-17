var fs = require('fs-extra')
var path = require('path')
var DOMParser = require('xmldom').DOMParser
var parse = require('../src/index').parse
var arcgisConvertor = require('../src/index').arcgisConvertor
var parseDescription = require('../src/index').parseDescription

var kmlDom = new DOMParser().parseFromString(fs.readFileSync('./test/kmls/石油管道.kml', 'utf8'))
var r = parse(kmlDom, { 
  style: true, 
  folderElements: ['Document', 'Folder', 'Placemark'],
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


// fs.writeJsonSync(path.resolve(__dirname, `./${Date.now()}.json`), JSON.stringify(r.graphicJSON))
console.log(r.folders);