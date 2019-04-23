## Introduction

This lib is modified from @mapbox/togeojson, enhanced with folder parse capability

## Install

```bash
npm i --save kml-parse
```

## Usage


```js
const kmlParse = require('kml-parse')
const fs = require('fs-extra')
const DOMParser = require('xmldom').DOMParser
const kmlDom = new DOMParser().parseFromString(fs.readFileSync('demo.kml', 'utf8'))

/**
 * returns folder tree and feature collection
 * return { folder: [], geoJSON: [] }
 */
kmlParse.parse(kmlDom)

/**
 * returns feature collection
 * This function is ported from @mapbox/togeojson, `tj.kml(kmlDom)`
 * 
 * feature.properties.folder = <folderKey>
 */
kmlParse.toGeoJSON(kmlDom)

/**
 * returns folder tree
 * folder: [{ key: <folderKey>, parent: <parentFolderKey>, name: <folderName>, children: [] }]
 */
kmlParse.parseFolder(kmlDom)
```