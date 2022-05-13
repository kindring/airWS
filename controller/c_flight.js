// 管理航班
const db_air = require('../database/d_air')
const db_area = require('../database/d_area')
const db_user = require('../database/d_user')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')
const str_action = require('../until/string_action')
let offsetTime = 7 * 24 * 60 * 60;
/**
 * 用户查询指定出发时间的航班
 * @param departureCity 出发城市
 * @param targetCity 目标城市
 * @param flightState 航线类型
 * @param startUnixTime 起飞时间开始
 * @param endUnixTime 起飞时间结束
 * @returns {Promise<*>}
 */
async function searchFlight(departureCity,targetCity,flightState,startUnixTime,endUnixTime){
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
    let flight = result[0];
    flight.maxTotalVotes = parseInt(flight.col) * parseInt(flight.row);
    // 查找已经售出数量
    [err,result] = await handle(db_air.flightOrder(flightId));
    if(err){throw err}
    let sold = result.reduce((acc,val)=>{
        // 查看是否有部分退票
        let ticketNum = parseInt(val.ticketNum);
        let refundTick = 0;
        if(val.refundTick){
            refundTick =  val.refundTick.split(',').length;
        }
        return acc+(ticketNum - refundTick)
    },0);
    flight.pay = sold;
    return flight;
}

/**
 * 获取航班的座位信息
 * @param flightId
 * @returns {Promise<void>}
 */
async function seatInfo(flightId){
    let err,result,flight,air,seat = {};
    [err,flight] = await handle(flightInfo(flightId));
    if(err){throw err}
    // 获取飞机信息
    [err,air] = await handle(airInfo(flight.airId));
    if(err){throw err}
    // 显示座位情况
    seat.row = air.row;
    seat.col = air.col;
    // 获取已经选坐的列表
    [err,result] = await handle(db_user.flightTickSeat(flightId));
    if(err){throw err}
    seat.selecteds = result.map(val=>{
        return {
            id:val.id,
            row: val.row,
            col: val.col,
        }
    })
    return seat;
}



async function searchFlights(state,options,page,limie){
    console.log(options);
    let searchItems = {
        departureCity:options.departureCity,
        targetCity:options.targetCity,
        startTime:options.startTime?(options.startTime-0)/1000:((new Date().getTime()-0)/1000),
        endTime:options.endTime,
        flightState: state,
        routeType: options.routeType,
        isLate: options.isLate,
        startPrice: options.startPrice,
        endPrice: options.endPrice,
    }
    let [err,result] = await handle(db_air.searchFlights(searchItems));
    if(err){throw err}
    console.log(result)
    return result;
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
    flightName,airId,
    originalPrice,currentPrice,
    sailingTime,langdinTime,
    totalVotes,departureCity,targetCity){
    let err,result,departCityType,targetCityType,routerType;
    // 检查参数
    if(!flightName||!airId||!originalPrice||!currentPrice||!sailingTime||!langdinTime||!totalVotes||!departureCity||!targetCity){
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
        airId,
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
    updateOptions.airId = updateOption.airId;
    updateOptions.originalPrice = updateOption.originalPrice;
    updateOptions.currentPrice = updateOption.currentPrice;
    updateOptions.sailingTime = updateOption.sailingTime;
    updateOptions.langdinTime = updateOption.langdinTime;
    updateOptions.totalVotes = updateOption.totalVotes;
    updateOptions.departureCity = updateOption.departureCity;
    updateOptions.targetCity = updateOption.targetCity;
    updateOptions.flightState = updateOption.flightState;
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
    let result = {},sellFlights,wicketFlights;
    [err,wicketFlights] = await handle(db_air.wicketFlights(nums));
    if(err){throw err}
    [err,sellFlights] = await handle(db_air.sellFlights(nums));
    if(err){throw err}
    result.sellFlights = sellFlights;
    result.wicketFlights = wicketFlights;
    return result;
}

/**
 * 新增飞机
 * @param airCode
 * @param row
 * @param col
 * @returns {Promise<*>}
 */
async function addAir(airCode,row,col){
    let [err,result] = await handle(db_air.addAir(airCode,row,col));
    if(err){throw err}
    return result;
}

/**
 * 飞机列表
 * @param state
 * @returns {Promise<*>}
 */
async function airs(state){
    let [err,result] = await handle(db_air.airs(state));
    if(err){throw err}
    return result;
}


async function airInfo(airId){
    let [err,result] = await handle(db_air.airInfo(airId));
    if(err){throw err}
    if(result.length<1){throw {rcode:codeMap.notFound,msg:'无法找到对应飞机'}}
    return result[0];
}

async function updateAir(airId,updateParam){
    let param = {
        airCode:updateParam.airCode,
        col:updateParam.col,
        row:updateParam.row,
    }
    let [err,result] = await handle(db_air.updateAir(airId,param));
    if(err){throw err}
    return result;
}

/**
 * 航班进入下一状态
 * @param flightId 航班id
 * @param nextState 下一个状态
 * @returns {Promise<*>}
 */
async function setState(flightId,nextState){
    let err,flight,result;
    // 获取航班信息
     [err,flight] = await handle(flightInfo(flightId));
    if(err){throw err}
    if(flight.flightState != (nextState -1)){
        throw {rcode:codeMap.customError,msg:'不允许跳级修改'}
    }
    [err,result] = await handle(db_air.updateFlight(flightId,{
        flightState:nextState
    }))
    if(err){throw err}
    if(nextState == 2){
        // 切换为检票,无操作
        console.log(`航班${flightId},开始检票`);
    }else if(nextState == 3){
        // 切换为飞行中,查看是否有订单是未值机的
        console.log(`航班${flightId},开始飞行`);
    }else if(nextState == 4){
        // 切换为订单完成
        // 查看是否有已经值机的用户
        [err,result] = await handle(db_user.okOrder(flightId))
        if(err){throw err}
    }
    return result;
}

module.exports = {
    searchFlight,
    flightList,
    addFlight,
    updateFlight,
    flightInfo,
    news,
    searchFlights,
    addAir,
    airs,
    updateAir,
    seatInfo,
    setState
}
