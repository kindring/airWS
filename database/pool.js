/*
 * @Description: 全局mysql连接
 * @Autor: kindring
 * @Date: 2021-12-14 11:12:13
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-15 14:34:31
 * @LastDescript: 
 */
const mysql = require('mysql2');
const databseConfig = require('../configs/database.json'); //数据库连接的配置文件
//作用

//导出全局连接池对象,使其可以统一使用此连接池操作数据库
const pool = mysql.createPool({
    connectionLimit: databseConfig.connectionLimit || 100, //连接限制
    host: databseConfig.host, //地址
    user: databseConfig.user, //用户
    password: databseConfig.password, // 密码
    database: databseConfig.database // 数据库名称
}); // 创建连接池对象



module.exports = pool;