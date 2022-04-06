const mysql = require('./mysql')
const field = require('../maps/field')
const code = require('../maps/rcodeMap')
const checkArgumentsIsEmpty = require('../until/checkArgumentsIsEmpty')
// 地区管理

/**
 * 新增地区
 * @param cityType 地区类型国际或者国内
 * @param cityName 城市名称
 * @returns {Promise<unknown>}
 */
function addArea(cityType = field.cityType_domestic,cityName){
    let sql=``,values=[];
    sql+=`insert into (cityname,cityType) values(?,?);`
    values.push(cityName,cityType)
    return mysql.pq(sql,values);
}

/**
 * 搜索地区
 * @param [cityType] 城市类型
 * @returns {Promise<unknown>}
 */
function searchAreas(cityType){
    let sql=``,values=[];
    sql+=`select * from area`
    if(cityType){
        sql+=' where cityType = ?'
        values.push(cityType)
    }
    sql+=`;`
    return mysql.pq(sql,values);
}

/**
 * 更新指定城市
 * @param cityId 城市id
 * @param cityType 新的城市类型
 * @param cityName 新的城市名
 * @returns {Promise<unknown>}
 */
function updateCity(cityId,cityType,cityName){
    let sql=``,values=[];
    if(checkArgumentsIsEmpty(Array.from(arguments))){throw {rcode:code.notParam}}
    sql+=`update area set`
    if(cityType){
        sql+=' cityType = ?'
        values.push(cityType)
    }
    if(cityName){
        sql+=' cityname = ?'
        values.push(cityName)
    }
    sql += ` where id = ?;`
    values.push(cityId);
    return mysql.pq(sql,values);
}