'use strict'

function isArr(a) {
    return Object.prototype.toString.call(a) === '[object Array]'
}

function isStr(a) {
    return typeof a === 'string'
}

function isFun(a) {
    return typeof a === 'function'
}

function selectOneDeep(tree, filter) {
    var list = []
    getBranchLoop(tree, list, filter)
    return list.shift()
}

function selectAllDeep(tree, filter) {
    var list = []
    getBranchLoop(tree, list, filter)
    return list
}

function selectOne(tree, filter) {
    var list = []
    getBranch(tree, list, filter)
    return list.shift()
}

function selectAll(tree, filter) {
    var list = []
    getBranch(tree, list, filter)
    return list
}

function getBranchLoop(tree, list, filter) {
    if (!isArr(tree) || !tree.length) {
        return null
    }
    filter = filter_formatter(filter)
    tree.forEach(function (a, i) {
        var need = filter(a, i)
        if (need) {
            list.push(a)
        }
        getBranchLoop(a.children, list, filter)
    })
}

function getBranch(tree, list, filter) {
    if (!isArr(tree) || !tree.length) {
        return null
    }
    filter = filter_formatter(filter)
    tree.forEach(function (a, i) {
        var need = filter(a, i)
        if (need) {
            list.push(a)
        }
    })
}

function filter_formatter(filter) {
    if (isStr(filter)) {
        return function (a) {
            return a.name === filter
        }
    }
    if (!isFun(filter)) {
        return function (a) {
            return true
        }
    }
    return filter
}

function El(data) {
    for(let key  in data) {
        this[key] = data[key]
    }
}

El.prototype.selectOne = function () {
    var params = this.select_arg_formatter(arguments)
    return selectOne(params.tree, params.filter)
}

El.prototype.selectAll = function () {
    var params = this.select_arg_formatter(arguments)
    return selectAll(params.tree, params.filter)
}

El.prototype.selectOneDeep = function () {
    var params = this.select_arg_formatter(arguments)
    return selectOneDeep(params.tree, params.filter)
}

El.prototype.getAttribute = function(name) {
    return this.attributes[name]
}

El.prototype.selectAllDeep = function () {
    var params = this.select_arg_formatter(arguments)
    return selectAllDeep(params.tree, params.filter)
}

El.prototype.select_arg_formatter = function(args) {
    var tree, filter
    if (args[1] !== undefined) {
        tree = args[0].children
        filter = args[1]
    } else {
        tree = this.children
        filter = args[0]
    }
    return {
        tree: tree,
        filter: filter,
    }
}

module.exports = El

