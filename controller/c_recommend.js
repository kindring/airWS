const db_air = require('../database/d_air')
const db_area = require('../database/d_area')
const db_recommend = require('../database/d_recommend')
const c_flight = require('./c_flight')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')


async function list(){
    let [err,result] = await handle(db_recommend.recommendList());
    if(err){throw err}
    return result;
}

async function addRecommend(name,descript,zIndex,imgUrl){
    let [err,result] = await handle(db_recommend.addRecommend(name,descript,zIndex,imgUrl));
    if(err){throw err}
    return result;
}

async function addFlight(recommendId,flightId,img,zIndex){
    let [err,result] = await handle(db_recommend.addFlight(recommendId,flightId,img,zIndex));
    if(err){throw err}
    return result;
}

/**
 * 修改推荐
 * @param recommendId
 * @param params
 * @returns {Promise<*>}
 */
async function changeRecommend(recommendId,params){
    let [err,result] = await handle(db_recommend.updateRecommend(recommendId, {
        recommendName:params.recommendName,
        discript:params.discript,
        zIndex:params.zIndex,
        bg:params.bg,
    }));
    if(err){throw err}
    return result;
}

async function deleteItem(recommendId,flightId){
    let [err,result] = await handle(db_recommend.deleteFlight(recommendId,flightId));
    if(err){throw err}
    return result;
}
/**
 * 修改推就项目信息
 * @param recommendId
 * @param flightId
 * @param params
 * @returns {Promise<void>}
 */
async function changeRecommendItem(recommendId,flightId,params){
    let [err,result] = await handle(db_recommend.updateRecommendItem(recommendId,flightId, {
        zIndex:params.zIndex,
        img:params.img,
    }));
    if(err){throw err}
    return result;
}

/**
 * 显示指定推荐的信息,以及他的所有航班信息
 * @returns {Promise<void>}
 */
async function recommendInfo(recommendId){
    let err,result,recommend;
    [err,result] = await handle(db_recommend.find(recommendId));
    if(err){throw err}
    if(result.length < 1){throw {rcode: codeMap.notFound,msg:'无法找到对应推荐'}}
    recommend = result[0];
    [err,result] = await handle(db_recommend.loadFlights(recommendId,true));
    if(err){throw err}
    recommend.flights = result;
    return recommend;
}
/**
 * 加载主要界面展示用的推荐,显示5个活动,每个活动显示前5个航班
 * @returns {Promise<void>}
 */
async function homeRecommends(){
    let err,recommends,flights;
    [err,recommends] = await handle(list());
    if(err){throw err}
    if(recommends.length){
        recommends = recommends.splice(0,5);
    }
    for (const recommend of recommends) {
        // 获取对应的航班信息
        [err,flights] = await handle(recommendInfo(recommend.id));
        if(err){throw err}
        flights=flights.flights;
        if(flights.length>=5){
            flights = flights.splice(0,5);
        }
        recommend.flights = flights;
    }
    console.log(recommends);
    return recommends;
}

async function recommendNot(recommendId){
    let [err,result] = await handle(db_recommend.loadFlights(recommendId,false));
    if(err){throw err}
    if(result.length < 1){
        // 没有任何航班,直接获取所有在售 的航班
        [err,result] = await handle(c_flight.flightList(field.flightState_sail));
        if(err){throw err}
        result = result.map(val=>{
            return {...val,flightId:val.id}
        })
    }
    let r = [];
    result.forEach((item) =>{
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        let ind = r.findIndex(val=>val.flightId===item.flightId)
        console.log(ind)
        if(ind===-1){
            r.push(item)
        }
    });
    console.log(r)
    return r;
}


module.exports = {
    list,
    addRecommend,
    addFlight,
    deleteItem,
    changeRecommend,
    changeRecommendItem,
    homeRecommends,
    recommendInfo,
    recommendNot,
}
