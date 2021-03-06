const handle = require("../until/handle");
const db_area = require("../database/d_area");
const code = require('../maps/rcodeMap');
/**
 * 新增城市
 * @param cityType
 * @param cityName
 * @returns {Promise<*>}
 */
async function addCity(cityType,cityName){
    let [err,result] = await handle(db_area.addArea(cityType,cityName));
    if(err){throw err}
    return result;
}

/**
 * 查询城市
 * @param [cityType]
 * @returns {Promise<*>}
 */
async function searchCity(cityType){
    let [err,result] = await handle(db_area.searchAreas(cityType));
    if(err){throw err}
    return result;
}

/**
 * 更新城市信息
 * @param cityId
 * @param cityName
 * @param cityType
 * @returns {Promise<*>}
 */
async function updateCity(cityId,cityName,cityType){
    if(!cityName&&!cityType){
        throw {rcode:code.notParam,msg:'至少需要一个参数'}
    }
    let [err,result] = await handle(db_area.updateCity(cityId,cityName,cityType));
    if(err){throw err}
    return result;
}





module.exports = {
    addCity,
    searchCity,
    updateCity
}
