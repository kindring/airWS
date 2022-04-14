const field = require('../maps/field');
const mysql = require('./mysql');
const until_time = require('../until/time');
const {getUnixTimeStamp} = require("../until/time");
const code = require("../maps/rcodeMap");
const checkArgumentsIsEmpty = require("../until/checkArgumentsIsEmpty");
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
function flightSearch(departureCity,targetCity,routeType,startUnixTime,endUnixTime){
    let sql=``,values=[];
    sql = `select f.id,f.originalPrice,f.currentPrice,f.sailingTime,f.langdinTime ,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select id,cityname from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityname from area ) as tar on tar.id = f.targetCity;
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
 * 显示所有航班列表,管理员级别
 * @param routeType
 * @returns {Promise | Promise<unknown>}
 */
function flightList(){
    let sql=``,values=[];
    sql=`select f.* ,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity;`;
    return mysql.pq(sql,values);
}

/**
 * 航班具体信息
 * @param flightId
 * @returns {Promise<unknown>}
 */
function flightInfo(flightId){
    let sql=``,values=[];
    sql+=`select ff.*,count(flightId = ? or null) as pay
            from 
            (select * from flight where id = ?) as ff,
            airTickets;`
    values.push(flightId,flightId)
    return mysql.pq(sql,values);
}

/**
 * 获取航班票数
 * @param flightId
 * @returns {Promise<unknown>}
 */
function flightTicks(flightId){
    let sql=``,values=[];
    sql=`select ff.*,count(t.flightId = ? or null) as pay
            from 
            (select totalVotes from flight where id = ?) as ff,
            airTickets as t`;
    values.push(flightId,flightId);
    return mysql.pq(sql,values);
}

/**
 * 添加航班
 * @param flightName 航班名
 * @param airCode 飞机代码
 * @param originalPrice 原始价格
 * @param currentPrice 当前价格
 * @param sailingTime 起飞时间
 * @param langdinTime 到站时间
 * @param totalVotes 机票数量
 * @param routeType 线路类型,国际or国内
 * @param departureCity 出发城市
 * @param targetCity 目标城市
 * @returns {Promise<unknown>}
 */
function addFlight(flightName,
                   airCode,
                   originalPrice,
                   currentPrice,
                   sailingTime,
                   langdinTime,
                   totalVotes,
                   routeType,
                   departureCity,
                   targetCity){
    let sql = ``,values = [];
    sql = `insert into flight 
    (flightName,airCode,originalPrice,currentPrice,
    sailingTime,langdinTime,
    totalVotes,routeType,
    departureCity,targetCity
    ) values(?,?,?,?,?,?,?,?,?,?)`;
    values.push(...arguments);
    sql += ';'
    return mysql.pq(sql,values);
}



/**
 * 修改航班信息
 * @param flightId
 * @param updateOptions
 * @returns {Promise<unknown>}
 */
function updateFlight(flightId,updateOptions){
    let sql=``,values=[];
    let _arguments = Array.from(arguments);

    // 判断如果所有参数都为空时抛出异常
    sql+=`update flight set `
    let keys = Object.keys(updateOptions);
    if(keys.length < 1){
        throw {rcode:code.notParam,msg:'没有修改项'}
    }
    for(let i = 0;i<keys.length;i++){
        let field = keys[i];
        if(!updateOptions[field]){continue;}
        console.log(i);
        if(values.length > 0){sql+=','}
        sql+=`${field} = ?`
        values.push(updateOptions[field])
    }
    sql += ` where id = ?;`
    values.push(flightId);
    return mysql.pq(sql,values);
}


function recommendFlight(){

}

module.exports = {
    flightSearch,
    addFlight,
    flightTicks,
    updateFlight,
    flightList,
    flightInfo
}
