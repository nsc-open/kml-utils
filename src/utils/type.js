function isNum(a) {
    return !isNaN(Number(a))
}

function isArr(a) {
    return Object.prototype.toString.call(a) === '[object Array]'
}

function isObj(a) {
    return Object.prototype.toString.call(a) === '[object Object]'
}

module.exports = {
    isNum: isNum,
    isArr: isArr,
    isObj: isObj,
}