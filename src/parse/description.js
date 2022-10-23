var { DOMParser } = require('xmldom-qsa')

exports.parse = function (cdata) {
  var attributes = {}
  // var html = cdata.substring('<![CDATA['.length, cdata.length - ']]>'.length)

  var descriptionDom = new DOMParser().parseFromString(cdata, 'text/html')
  if (!descriptionDom) return attributes
  var descriptionDocument = descriptionDom.documentElement
  if (!descriptionDocument) return attributes
  var tds = descriptionDocument.querySelectorAll('td>table td')
  if (!tds) return attributes
  
  for (var i = 0; i < tds.length; i += 2) {
    var key = tds[i].textContent
    var value = tds[i + 1].textContent
    // skip empty value
    if (!value || value === '&lt;空&gt;') {
      continue
    }

    attributes[key] = value
  }

  return attributes
}
