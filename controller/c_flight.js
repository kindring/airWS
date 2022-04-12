// 管理航班
const db_air = require('../database/d_air')
const db_area = require('../database/d_area')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')

/**
 *
 * @param departureCity 出发城市
 * @param targetCity 目标城市
 * @param routeType 航线类型
 * @param startUnixTime 起飞时间开始
 * @param endUnixTime 起飞时间结束
 * @returns {Promise<*>}
 */
async function searchFlight(departureCity,targetCity,routeType,startUnixTime,endUnixTime){
    let [err,result] = await handle(db_air.flightSearch(...arguments));
    if(err){throw err}
    return result;
}

/**
 * 航班列表
 * @param routeType 航班类型
 * @returns {Promise<*>}
 */
async function flightList(routeType){
    let [err,result] = await handle(db_air.flightList(routeType));
    if(err){throw err}
    return result;
}



/**
 * 新增航班
 * @param flightName 航班代号
 * @param airCode 飞机代号
 * @param originalPrice 原始价格
 * @param currentPrice 当前价格
 * @param seilingTime 出发时间
 * @param langdingTime 落地时间
 * @param totalVotes 票数量
 * @param departureCity 出发城市id
 * @param targetCity 目标城市id
 * @returns {Promise<*>}
 */
async function addFlight(
    flightName,airCode,
    originalPrice,currentPrice,
    seilingTime,langdingTime,
    totalVotes,departureCity,targetCity){
    let err,result,departCityType,targetCityType,routerType;
    // 检查参数
    if(!flightName||!airCode||!originalPrice||!currentPrice||!seilingTime||!langdingTime||!totalVotes||!departureCity||!targetCity){
        throw {rcode:codeMap.notParam,msg:``}
    }
    // 判断时间是否合法
    if(seilingTime >= langdingTime){
        throw {rcode:codeMap.customError,msg:`出发时间晚于到站时间`}
    }
    // 获取城市类型
    [err,departCityType] = await handle(db_area.cityType(departureCity));
    [err,targetCityType] = await handle(db_area.cityType(targetCity));
    if(!departCityType.length||!targetCityType.length){
        console.log('------error------')
        console.log(departCityType);
        console.log(targetCityType);
        throw {rcode:codeMap.customError,msg:`未知的起始城市`}
    }
    departCityType = departCityType[0].cityType;
    targetCityType = targetCityType[0].cityType;
    if(departCityType==field.cityType_domestic&&targetCityType==field.cityType_domestic){
        routerType=field.routeType_domestic;
    }else{
        routerType=field.routeType_international;
    }
    if(err){throw err}
    [err,result] = await handle(db_air.addFlight(
        flightName,
        airCode,
        originalPrice,
        currentPrice,
        seilingTime,
        langdingTime,
        totalVotes,
        routerType,
        departureCity,
        targetCity
    ));
    if(err){throw err}
    return result;
}

module.exports = {
    searchFlight,
    flightList,
    addFlight,

}
