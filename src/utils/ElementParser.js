'use strict'
var El = require('./El')

function isArr(a) {
    return Object.prototype.toString.call(a) === '[object Array]'
}

function getElementList(content) {
    // str = str.replace(/[\n\t]+/mg, ' ')
    var elementList = content.match(/<[^<>]*>|[^<>]+/g).filter(function (a) {
        return a.trim() !== ''
    })
    return elementList
}

function getList(elementList) {
    var list = [] //拉平的树
    // 获取 start 和 end
    for (var i = 0; i < elementList.length; i++) {
        var item = elementList[i]
        var tagData = getTagData(item)
        var isClose = tagData.isClose
        var isWhole = tagData.isWhole
        var name = tagData.name
        if (name === undefined) {
            // console.log('error tag name =', i, name)
            continue
        }
        if (isWhole) {
            var el = new El({ name, start: i, end: i, el: item, attributes: getAttributes(item), innerHTML: null })
            list.push(el)
        } else if (isClose) {
            var index = list.findIndex(function (a) {
                return a.name === name && a.start === a.end
            })
            if (index < 0) {
                console.log('error tag close =', i, name)
                continue
            }
            var cur = list[index]
            // 插入
            cur.end = i
            cur.innerHTML = elementList.slice(cur.start + 1, cur.end).join('')
        } else {
            var el = new El({ name, start: i, end: i, el: item, attributes: getAttributes(item), innerHTML: null })
            list.push(el)
        }
    }
    return list
}

// 分组
function getTree(list) {
    for (var a of list) {
        var parent = getParent(list, a)
        if (parent) {
            a.parent = parent
            if (isArr(parent.children)) {
                parent.children.push(a)
            } else {
                parent.children = [a]
            }
        }
    }
    var roots = getRoots(list)

    return new El({ children: roots })
}
// getTree(["<Data name=\"stroke\">", "<value>", "ff4f3e", "</value>", "</Data>", "<Data name=\"stroke-opacity\">", "<value>", "undefined", "</value>", "</Data>", "<Data name=\"stroke-width\">", "<value>", "undefined", "</value>", "</Data>", "<Data name=\"type\">", "<value>", "polyline", "</value>", "</Data>", "<Data name=\"folder\">", "<value>", "75de7ad1-fdeb-11ed-990f-f18e4f5f483f", "</value>", "</Data>", "<Data name=\"parent\">", "<value>", "2", "</value>", "</Data>", "<Data name=\"key\">", "<value>", "12", "</value>", "</Data>", "<Data name=\"styleUrl\">", "<value>", "#sff4f3esw3mo1", "</value>", "</Data>", "<Data name=\"styleHash\">"])

function getParent(list, item) {
    var parent = null
    for (var a of list) {
        if (a.start >= item.start || a.end <= item.end) {
            continue
        }
        if (!parent) {
            parent = a
        } else if (a.start > parent.start && a.end < parent.end) {
            parent = a
        }
    }
    return parent
}

function getRoots(list) {
    var roots = []
    for (var a of list) {
        if (!roots.length) {
            roots.push(a) //第一次添加
        } else if (roots.some(function (b) {
            return b.start < a.start && b.end > a.end
        })) {
            continue //在范围内
        } else if (roots.every(function (b) {
            return b.start > a.start
        })) {
            roots.unshift(a) //最小的
        } else if (roots.every(function (b) {
            return b.end < a.end
        })) {
            roots.push(a) //最大的
        } else {
            var index = roots.findIndex(function (b, i) {
                return b.start > a.end && roots[i - 1].end < a.start
            })
            if (index < 0) {
                console.log('roots error =', a)
                continue
            }
            roots.splice(index, 0, a) //中间的
        }
    }
    return roots
}

function parse(content) {
    var elementList = getElementList(content)
    var list = getList(elementList)
    var result = getTree(list)
    return result
}

function getAttributes(el) {
    var reg = /^\s*<\??\S*/
    var reg2 = /(\?|\/)?>\s*$/
    var reg1 = /\s*([^\s=<>]+)\s*(=\s*"([^"]*)")?/g
    var attributes = {}
    el.replace(reg, '').replace(reg2, '').replace(reg1, function (s, s1, s2, s3) {
        if (s3 === undefined) {
            s3 = true
        }
        attributes[s1] = s3
        return s
    })
    return attributes
}
// getAttributes('<kml xmlns:link="http://www.opengis.net/kml/2.2"> name = "123" disabled>')
// getAttributes('<?xml version="1.0" encoding="UTF-8"?>')

function getTagData(el) {
    var reg = /\s*<(\/|\?)?\s*([^\s\/\?]*)?(\s*[^=\s/?]*\s*(=\s*"[^"]*")?)*\s*(\/|\?)?>s*/
    var ms = el.match(reg) || []
    var result = {
        isClose: !!(ms[1]), //是否结束标签
        isWhole: !!(ms[5]), //是否是完整的标签
        name: ms[2], //标签名
    }
    return result
}
// getTagData('<div>')
// getTagData('</div>')
// getTagData('<div/>')
// getTagData('<?xml version="1.0" encoding="UTF-8"?>')
// getTagData('<kml xmlns="http://www.opengis.net/kml/2.2" name="1">')
// getTagData('</>')
// getTagData('<>')

function ElementParser(content) {
    // this.content = content
    this.elementList = getElementList(content)
    this.list = getList(this.elementList)
    this.tree = getTree(this.list)
}

module.exports = ElementParser