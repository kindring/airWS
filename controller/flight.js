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



async function addFlight(departureCity,targetCity,routeType,startUnixTime,endUnixTime){
    let [err,result] = await handle(db_air.flightSearch(...arguments));
    if(err){throw err}
    return result;
}

module.exports = {
    searchFlight
}
