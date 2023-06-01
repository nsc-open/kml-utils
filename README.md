## Introduction

This lib is modified from @mapbox/togeojson and @mapbox/tokml, enhanced with folder capability

## Install

```bash
npm i --save kml-utils
```

## Parse Usage

```js
const { parse, parseFolder, parseGeoJSON } = require('kml-utils')
const fs = require('fs-extra')
const kmlContent = fs.readFileSync('demo.kml', 'utf8')

/**
 * returns folder tree and feature collection
 * return { folder: [], geoJSON: [] }
 */
parse(kmlContent)

parse(kmlContent, {
    // parse style
    style: true,
    // parse elements to folder tree
    folderElements: ['Document', 'Folder'],
    propertyCallbacks:{
        description(){
            // return a value to replace the property's value
            // return '123'

            // return an object to replace the property
            // return { newName:123 }

            // parse html-type-description
            data.key = 'test'
            return data
        }
    },
    coordCallback(point, attributes){
        // point transform
        return point.map(a => a+1000 )
    }
})

/**
 * returns feature collection
 * This function is ported from @mapbox/togeojson, `tj.kml(kmlContent)`
 * 
 * feature.properties.folder = <folderKey>
 */
parseGeoJSON(kmlContent)

/**
 * returns folder tree
 * folder: [{ key: <folderKey>, parent: <parentFolderKey>, name: <folderName>, children: [] }]
 */
parseFolder(kmlContent)
```

You can convert to arcgis graphic json object:

```js
const { parseGeoJSON, arcgisConvertor } = require('kml-utils')
const _ = require('lodash')
const graphicJSONs = _.flatten(parseGeoJSON(kmlContent).features.map(arcgisConvertor.graphicJSON))
```

## Kmlify Usage

```js
const { parse, kmlify } = require('kml-utils')
const { geoJSON, folders } = parse(kmlContent)
const kmlString = kmlify(geoJSON, folders)
```