/*
 * @Description: 操作mysql相关的工具函数
 * @Autor: kindring
 * @Date: 2021-12-14 15:34:59
 * @LastEditors: kindring
 * @LastEditTime: 2022-01-25 18:29:18
 * @LastDescript: 
 */
const pool = require('./pool');
const log = require('../logger').logger('database')

/**
 * callback方式查询数据库
 * @param {*} sql 
 * @param {*} values 
 * @param {*} cb 
 */
function query(sql, values, cb) {
    pool.getConnection((err, conn) => {
        if (err) { log.error(err.message); return cb(err) }
        log.debug(`querySQL:${sql}  QueryValues:[${values.join(',')}]`)
        conn.query(sql, values, cb);
        conn.release();
    })
} //简写部分代码

/**
 * 以promise方式查询数据库
 * @param {*} sql 
 * @param {*} values 
 * @returns 
 */
function pq(sql, values = []) {
    return new Promise((resolve, reject) => {
        query(sql, values, function(err, result) {
            if (err) {
                // 自动通过日志记录数据库查询错误的部分
                log.info(`sql: ${sql} \nvalues: ${values.join(',')}`)
                log.error(`Error ${err.message}`);
                reject(err);
                return
            }
            resolve(result);
        });
    })
}

module.exports = {
    query,
    pq
}
