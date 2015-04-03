'use_strict'

module.exports= DbService



var mysql= require('mysql')
var co= require('co')



/**
 * DbService
 *
 * @constructor
 * @return {DbService}
 */
function DbService(config) {

    this.config= config

    this.sqlPool= mysql.createPool(config)

}



DbService.prototype.getPool= function () {
    return this.sqlPool
}



/**
 * query raw
 *
 * @param {Object} connection
 * @param {Mixed} query
 * @return {Mixed}
 */
DbService.prototype.queryRaw= function (connection) {
    var args= Array.prototype.slice.call(arguments)
    var connection= args.shift()
    return function (callback) {
        args.push(function (err, result) {
            if (err) {
                return callback(err)
            }
            callback(err, result)
        })
        try {
            connection.query.apply(connection, args)
        } catch (err) {
            callback(err)
        }
    }
}

/**
 * query
 *
 * @param {Object} connection
 * @param {Object} query
 * @return {Mixed}
 */
DbService.prototype.query= function (connection, query) {
    return function (callback) {
        try {
            if (query instanceof Array) {
                query= query.reduce(function (result, query) {
                    query= query.toQuery('mysql') // @todo
                    if (!result.text) {
                        result.text= query.text
                    } else {
                        result.text= [ result.text, query.text ].join('; ')
                    }
                    result.values= result.values.concat(query.values)
                    return result
                }, { text:'', values:[] })
            } else {
                query= query.toQuery('mysql') // @todo
            }
            connection.query({ sql:query.text, values:query.values }, function (err, result) {
                if (err) {
                    return callback(err)
                }
                callback(err, result)
            })
        } catch (err) {
            callback(err)
        }
    }
}
