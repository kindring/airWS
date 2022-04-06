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
 * @param airplaneCode 飞机代码
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
                   airplaneCode,
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
    (
        flightName,airplaneCode,
        originalPrice,currentPrice,
        sailingTime,langdinTime,
        totalVotes,routeType,
        departureCity,targetCity
    ) values(
        ?,?,
        ?,?,
        ?,?,
        ?,?
        )`;
    values.push(...arguments);
    sql += ';'
    return mysql.pq(sql,values);
}

/**
 * 修改航班信息
 * @param flightId
 * @param flightName
 * @param airplaneCode
 * @param originalPrice
 * @param currentPrice
 * @param sailingTime
 * @param langdinTime
 * @param totalVotes
 * @param routeType
 * @param departureCity
 * @param targetCity
 * @returns {Promise<unknown>}
 */
function updateFlight(
                      flightId,
                      flightName,
                      airplaneCode,
                      originalPrice,
                      currentPrice,
                      sailingTime,
                      langdinTime,
                      totalVotes,
                      routeType,
                      departureCity,
                      targetCity){
    let sql=``,values=[];
    let _arguments = Array.from(arguments);

    // 判断如果所有参数都为空时抛出异常
    if(checkArgumentsIsEmpty(Array.from(arguments))){
        throw {rcode:code.notParam}
    }
    sql+=`update area set`
    //航班名
    if(flightName){
        sql+=' flightName = ?'
        values.push(flightName)
    }
    //机票代码
    if(airplaneCode){
        sql+=' airplaneCode = ?'
        values.push(airplaneCode)
    }
    //原始价格
    if(originalPrice){
        sql+=' originalPrice = ?'
        values.push(originalPrice)
    }
    // 当前价格
    if(currentPrice){
        sql+=' currentPrice = ?'
        values.push(currentPrice)
    }
    //起飞时间
    if(sailingTime){
        sql+=' sailingTime = ?'
        values.push(sailingTime)
    }
    // 登录时间
    if(langdinTime){
        sql+=' langdinTime = ?'
        values.push(langdinTime)
    }
    //票数
    if(totalVotes){
        sql+=' totalVotes = ?'
        values.push(totalVotes)
    }
    //航线类型
    if(routeType){
        sql+=' routeType = ?'
        values.push(routeType)
    }
    //出发城市
    if(departureCity){
        sql+=' departureCity = ?'
        values.push(departureCity)
    }
    // 目标城市
    if(targetCity){
        sql+=' targetCity = ?'
        values.push(targetCity)
    }
    sql += ` where id = ?;`
    values.push(flightId);
    return mysql.pq(sql,values);
}


function recommendFlight(){

}