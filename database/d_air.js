const field = require('../maps/field');
const mysql = require('./mysql');
const until_time = require('../until/time');
const {getUnixTimeStamp} = require("../until/time");
const code = require("../maps/rcodeMap");
const fields = require("../maps/field");
const checkArgumentsIsEmpty = require("../until/checkArgumentsIsEmpty");
const {loadFlights} = require("./d_recommend");
// 查询指定城市航班


/**
 * 获取飞机列表
 * @param [state] 飞机状态,默认为
 * @returns {Promise | Promise<unknown>}
 */
function airs(state){
    let sql=``,values=[];
    sql = `select * from air`;
    if(state == 1 || state == 2){
        sql+= ` where state = ?`
        values.push(state)
    }
    sql+=';';
    return mysql.pq(sql,values);
}

/**
 * 新增飞机
 * @param airCode
 * @param row
 * @param col
 * @returns {Promise | Promise<unknown>}
 */
function addAir(airCode,row,col){
    let sql=``,values=[];
    sql = `insert into air(airCode,\`row\`,col) values(?,?,?)`;
    sql+=';';
    values.push(...arguments);
    return mysql.pq(sql,values);
}

/**
 * 更新飞机
 * @param airId 飞机id
 * @param params 要修改的飞机信息
 * @returns {Promise | Promise<unknown>}
 */
function updateAir(airId,params){
    let sql=`update air set`,values=[];
    let fields = Object.keys(params);
    fields = fields.filter(field=>params[field])
    if(fields.length<1){
        throw {rcode:code.notParam}
    }
    for(let field of fields) {
        if (!params[field]) {
            continue;
        }
        if(values.length>0){sql+=','}
        sql+=` \`${field}\` = ?`
        values.push(params[field])
    }
    sql+=` where id=?`;
    values.push(airId)
    return mysql.pq(sql,values);
}


/**
 * 查询相关航班信息
 * @param departureCity 除非城市id
 * @param targetCity 目标城市id
 * @param [flightState] 航班类型,国内或者国际
 * @param [startUnixTime] 出发时间开始,某个时间点之前
 * @param [endUnixTime] 出发时间截止,某个时间段内的
 * @returns {Promise | Promise<unknown>}
 */
function flightSearch(departureCity,targetCity,flightState,startUnixTime,endUnixTime){
    let sql=``,values=[];
    sql = `select 
                f.id,f.originalPrice,f.currentPrice,f.sailingTime,f.langdinTime ,
                air.airCode,air.row,air.col
                dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select * from air ) as air on air.id = f.airId
            LEFT JOIN (select id,cityname from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityname from area ) as tar on tar.id = f.targetCity;
            where f.departureCity = ? and f.targetCity = ?`;
    values.push(departureCity,targetCity);
    if(flightState){
        sql += ` and f.flightState = ?`;
        values.push(flightState);
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
    sql=`select f.* ,air.airCode,air.row,air.col,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select * from air ) as air on air.id = f.airId
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity;`;
    return mysql.pq(sql,values);
}

/**
 * 查询航班对应的订单,仅限新创建以及已经支付的,以及部分退票
 * @param flightId 航班id
 * @returns {Promise | Promise<unknown>}
 */
function flightOrder(flightId){
    let sql=``,values=[];
    sql+=`select * from orders where flightId = ? 
        and (payState = ? or payState = ? or payState = ?)`
    values.push(
        flightId,
        fields.payState_pay,
        fields.payState_create,
        fields.payState_rebates
    );
    return mysql.pq(sql,values);
}





/**
 * 航班具体信息
 * @param flightId
 * @returns {Promise<unknown>}
 */
function flightInfo(flightId){
    let sql=``,values=[];
    sql+=`select f.*,
        air.airCode,air.row,air.col,
        dep.cityname as departureCityName,tar.cityname as targetCityName
        from 
        (select * from flight where id = ?) as f
        LEFT JOIN (select * from air ) as air on air.id = f.airId
        LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
        LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity`
    values.push(flightId)
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
            airTickets as t 
            where t.payState != '1' and t.payState != '4'`;
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
                   airId,
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
    (flightName,airId,originalPrice,currentPrice,
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


/**
 *
 * @param searchItems
 * @param cityName
 * @param page
 * @param limit
 * @returns {Promise | Promise<unknown>}
 */
function searchFlights(searchItems,cityName = true,page = 1,limit){
    let sql=`select`,values=[];
    if(cityName){
        sql+=' f.*,dep.cityname as departureCityName,tar.cityname as targetCityName'
        sql+=` from
            flight as f
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity`
    }else{
        sql+=' f.*';
        sql+=` from
            flight as f`;
    }
    sql+=' where '
    // 根据类型
    let fields = Object.keys(searchItems);
    fields = fields.filter(field=>searchItems[field])
    if(fields.length<1){
        throw {rcode:code.notParam}
    }
    for(let field of fields){
        // console.log(`${field} : ${searchItems[field]}`)
        if(!searchItems[field]){
            continue;
        }

            if(values.length>=1)sql += ' and';
            if(field === 'startTime'){
                sql+=` f.sailingTime >= ?`
            }else if(field === 'endTime'){
                sql+=` f.sailingTime <= ?`
            }else if(field === 'startPrice'){
                sql+=` f.currentPrice >= ?`
            }else if(field === 'endPrice'){
                sql+=` f.currentPrice <= ?`
            }else{
                sql+=` f.${field} ${searchItems[field].action||'='} ?`
            }
            values.push(searchItems[field]);

    }
    sql+=' order by createTime desc'
    if(limit){
        sql+=` limit ?,?;`
        values.push((page-1)*limit,limit)
    }
    sql+=';'
    return mysql.pq(sql,values);
}
/**
 * 售票的航班信息
 * @param num
 * @returns {Promise<unknown>}
 */
function sellFlights(num = 5){
    let sql=``,values=[];
    // 判断状态为
    sql+=`select f.id,f.currentPrice,f.sailingTime,f.langdinTime,f.flightState,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity
            where flightState = ? ORDER BY f.createTime desc limit 0,?;`
    values.push(fields.flightState_sail,num);
    return mysql.pq(sql,values);
}

/**
 * 检票中的航班信息
 * @param num
 * @returns {Promise<unknown>}
 */
function wicketFlights(num = 5){
    let sql=``,values=[];
    // 判断状态为
    sql+=`select f.id,f.currentPrice,f.sailingTime,f.langdinTime,f.flightState,f.createTime,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity
            where flightState = ? ORDER BY f.sailingTime desc limit 0,?;`
    values.push(fields.flightState_wicket,num);
    return mysql.pq(sql,values);
}

module.exports = {
    flightSearch,
    addFlight,
    flightTicks,
    updateFlight,
    flightList,
    flightInfo,
    wicketFlights,
    searchFlights,
    sellFlights,
    flightOrder,
    airs,
    addAir,
    updateAir
}
