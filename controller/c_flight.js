// 管理航班
const db_air = require('../database/d_air')
const db_area = require('../database/d_area')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')

/**
 * 用户查询指定出发时间的航班
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
 * 航班列表,所有航班列表
 * @param routeType 航班类型
 * @returns {Promise<*>}
 */
async function flightList(routeType){
    let [err,result] = await handle(db_air.flightList(routeType));
    if(err){throw err}
    return result;
}

/**
 * 航班具体信息,用来给用户直接查看航班
 * @param flightId
 * @returns {Promise<void>}
 */
async function flightInfo(flightId){
    let [err,result] = await handle(db_air.flightInfo(flightId));
    if(err){throw err}
    if(!result.length){
        throw {rcode:codeMap.notFound,msg:'无法找到航班'}
    }
    return result[0];
}


/**
 * 新增航班
 * @param flightName 航班代号
 * @param airCode 飞机代号
 * @param originalPrice 原始价格
 * @param currentPrice 当前价格
 * @param sailingTime 出发时间
 * @param langdinTime 落地时间
 * @param totalVotes 票数量
 * @param departureCity 出发城市id
 * @param targetCity 目标城市id
 * @returns {Promise<*>}
 */
async function addFlight(
    flightName,airCode,
    originalPrice,currentPrice,
    sailingTime,langdinTime,
    totalVotes,departureCity,targetCity){
    let err,result,departCityType,targetCityType,routerType;
    // 检查参数
    if(!flightName||!airCode||!originalPrice||!currentPrice||!sailingTime||!langdinTime||!totalVotes||!departureCity||!targetCity){
        throw {rcode:codeMap.notParam,msg:``}
    }
    // 判断时间是否合法
    if(sailingTime >= langdinTime){
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
        sailingTime,
        langdinTime,
        totalVotes,
        routerType,
        departureCity,
        targetCity
    ));
    if(err){throw err}
    return result;
}

/**
 * 修改航班信息
 * @param flightId
 * @param updateOption
 * @returns {Promise<void>}
 */
async function updateFlight(flightId,updateOption){
    let err,result,departCityType,targetCityType,routerType;
    let updateOptions = {}
    console.log(flightId);
    console.log(updateOption);
    // 如果修改了城市,那么直接修改对应的航班类型
    if(updateOption.departureCity){
        [err,departCityType] = await handle(db_area.cityType(updateOption.departureCity));
        if(err) throw err;
        departCityType = departCityType[0].cityType;
        if(departCityType){
            // 判断是否为国内城市
            if(departCityType==field.cityType_international){
                routerType = field.routeType_international;
            }
        }
    }
    if(updateOption.targetCity){
        [err,targetCityType] = await handle(db_area.cityType(updateOption.departureCity));
        if(err) throw err;
        targetCityType = targetCityType[0].cityType;
        if(targetCityType) {
            // 判断是否为国内城市
            if (targetCityType == field.cityType_international) {
                routerType = field.routeType_international;
            }
        }
    }

    if(routerType){
        updateOptions.routeType = routerType;
    }
    updateOptions.flightName = updateOption.flightName;
    updateOptions.airCode = updateOption.airCode;
    updateOptions.originalPrice = updateOption.originalPrice;
    updateOptions.currentPrice = updateOption.currentPrice;
    updateOptions.sailingTime = updateOption.sailingTime;
    updateOptions.langdinTime = updateOption.langdinTime;
    updateOptions.totalVotes = updateOption.totalVotes;
    updateOptions.departureCity = updateOption.departureCity;
    updateOptions.targetCity = updateOption.targetCity;
    [err,result] = await handle(db_air.updateFlight(flightId,updateOptions));
    if(err) throw err;
    return result
}

/**
 * 航班相关新闻
 * @param nums 每种类型的数量
 * @returns {Promise<void>}
 */
async function news(nums){
    let result = {},sailFlights,wicketFlights;
    [err,wicketFlights] = await handle(db_air.wicketFlights(nums));
    if(err){throw err}
    [err,sailFlights] = await handle(db_air.sailFlights(nums));
    if(err){throw err}
    result.sailFlights = sailFlights;
    result.wicketFlights = wicketFlights;
    return result;
}

module.exports = {
    searchFlight,
    flightList,
    addFlight,
    updateFlight,
    flightInfo,
    news
}
