exports.FOLDER_KEY_NAME = '_fkey'

exports.DEFAULT_KML_STYLES = {
  polySyleColor: '88555555',
  lineStyleColor: 'ff555555',
  lineWidth: 2
}

exports.DEFAULT_SYMBOLS = {
  marker: {
    type: 'esriSMS',
    style: 'esriSMSCircle',
    color: [255, 0, 0, 64],
    size: 10,
    angle: 0,
    xoffset: 0,
    yoffset: 0,
    outline: {
      color: [255, 0, 0, 255],
      width: 1,
      style: 'esriSLSSolid',
      type: 'esriSLS'
    }
  },
  polyline: {
    type: 'esriSLS',
    style: 'esriSLSSolid',
    color: [255, 0, 0, 255],
    width: 2
  },
  polygon: {
    type: 'esriSFS',
    style: 'esriSFSSolid',
    color: [255, 0, 0, 64],
    outline: {
      type: 'esriSLS',
      style: 'esriSLSSolid',
      color: [255, 0, 0, 255],
      width: 2
    }
  }
}