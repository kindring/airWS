const field = require('../maps/field');
const mysql = require('./mysql');
const until_time = require('../until/time');
const {getUnixTimeStamp} = require("../until/time");
// 查询指定城市航班


/**
 * 查询相关航班信息
 * @param departureCity 除非城市id
 * @param targetCity 目标城市id
 * @param [routeType] 航班类型,国内或者国际
 * @param [startUnixTime] 出发时间开始,某个时间点之前
 * @param [endUnixTime] 出发时间截止,某个时间段内的
 * @returns {Promise | Promise<unknown>}
 */
function fightSearch(departureCity,targetCity,routeType,startUnixTime,endUnixTime){
    let sql=``,values=[];
    sql = `select f.* ,dep.cityname as departureCityName,tar.cityname as targetCityName from
            flight as f
            LEFT JOIN (select id,cityname from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityname from area ) as tar on tar.id = f.targetCity
            where f.departureCity = ? and f.targetCity = ?`;
    values.push(departureCity,targetCity);
    if(routeType){
        sql += ` and f.routerType = ?`;
        values.push(routeType);
    }
    if(endUnixTime){
        // 如果有结束时间,没有开始时间则默认添加
        if (!startUnixTime) startUnixTime=getUnixTimeStamp();
        sql += ` and f.sailingTime <= ?`;
        values.push(endUnixTime);
    }
    if(startUnixTime){
        sql += ` and f.sailingTime >= ?`;
        values.push(startUnixTime);
    }
    sql+=`;`
    return mysql.pq(sql,values);
}


/**
 * 获取航班票数
 * @param fightId
 * @returns {Promise<unknown>}
 */
function fightTicks(fightId){
    let sql=``,values=[];
    sql=`select ff.*,count(t.flightId = 1 or null) as pay
            from 
            (select totalVotes from flight where id = 1) as ff,
            airTickets as t`
    return mysql.pq(sql,values);
}
