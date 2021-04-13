var jsdom = require('jsdom')

exports.parse = function (cdata) {
  var html = cdata.substring('<![CDATA['.length, cdata.length - ']]>'.length)

  var descriptionDom = new jsdom.JSDOM(html)
  var descriptionDocument = descriptionDom.window.document

  var tds = descriptionDocument.querySelectorAll('td>table td')
  var attributes = {}

  for (var i = 0; i < tds.length; i += 2) {
    var key = tds[i].innerHTML
    var value = tds[i + 1].innerHTML
    // skip empty value
    if (!value || value === '&lt;空&gt;') {
      continue
    }
    
    attributes[key] = value
  }

  return attributes
}
