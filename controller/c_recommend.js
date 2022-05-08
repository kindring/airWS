const db_air = require('../database/d_air')
const db_area = require('../database/d_area')
const db_recommend = require('../database/d_recommend')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')


async function list(){
    let [err,result] = await handle(db_recommend.recommendList());
    if(err){throw err}
    return result;
}

async function addRecommend(name,descript,zIndex){
    let [err,result] = await handle(db_recommend.addRecommend(name,descript,zIndex));
    if(err){throw err}
    return result;
}

async function addFlights(recommendId,flights){
    let [err,result] = await handle(db_recommend.addFlights(recommendId,flights));
    if(err){throw err}
    return result;
}

async function changeRecommend(recommendId,params){
    let [err,result] = await handle(db_recommend.updateRecommend(recommendId, {
        recommendName:params.recommendName,
        recommendName:params.descript,
        recommendName:params.zIndex,
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

module.exports = {
    list,
    addRecommend,
    addFlights,
    changeRecommend,
    homeRecommends
}
