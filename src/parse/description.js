var jsdom = require('jsdom')

exports.parse = function (cdata) {
  const html = cdata.substring('<![CDATA['.length, cdata.length - ']]>'.length)

  const descriptionDom = new jsdom.JSDOM(html)
  const descriptionDocument = descriptionDom.window.document

  const tds = descriptionDocument.querySelectorAll('td>table td')
  const attributes = {}

  for (let i = 0; i < tds.length; i += 2) {
    const key = tds[i].innerHTML
    const value = tds[i + 1].innerHTML
    // skip empty value
    if (!value || value === '&lt;空&gt;') {
      continue
    }
    
    attributes[key] = value
  }

  return attributes
}