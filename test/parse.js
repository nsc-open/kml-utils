var fs = require('fs-extra')
var path = require('path')
var parse = require('../src/index').parse
var arcgisConvertor = require('../src/index').arcgisConvertor

var filePath = path.join(__dirname, './kmls/export.kml')
var content = fs.readFileSync(filePath, 'utf8')
var r = parse(content, { 
  style: true, 
  folderElements: ['Document', 'Folder'],
  defaultFolderName: 'test',
  // propertyCallbacks: {
  //   description(data){
  //     data.name = 'test'
  //     return data
  //   }
  // },
  // coordCallback(coord, attributes){
  //   return coord.map(a => a+1000)
  // },
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