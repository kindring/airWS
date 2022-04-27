const db_user = require('../database/d_user')
const d_air = require('../database/d_air')
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')
const {userType} = require("../maps/field");
// 处理账号的注册登录,

async function checkAccount(account,userType= field.userType){
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err){throw err}
    // 查看是否有结果
    if (result.length >= 1 ) {throw {rcode:codeMap.notFound,msg:'该账户已经被注册'}}
    return true;
}
/**
 * 用户登录,返回用户名
 * @param userType
 * @param account
 * @param passwd
 * @returns {Promise<*>}
 */
async function login(userType = field.userType,account,passwd){
    let [err,result] = await handle(db_user.login(userType,account,passwd));
    if(err){throw err}
    // 查看是否有结果,没有结果自动告知账户或者密码错误
    if (result.length < 1 ) {throw {rcode:codeMap.notFound,msg:'账号或者密码错误'}}
    // 账号被冻结
    if (result[0].state == field.userFreezeState ){throw {rcode:codeMap.permissionDenied,msg:'账号被冻结'}}
    return result[0].account;
}

/**
 * 修改账户密码
 * @param type
 * @param account
 * @param oldPasswd
 * @param newPasswd
 * @returns {Promise<void>}
 */
async function changePasswd(type,account,oldPasswd,newPasswd){
    // 根据账号和原密码查找id
    let [err,result] = await handle(db_user.login(type,account,oldPasswd));
    if(err)throw err;
    if (result.length < 1 ) {throw {rcode:codeMap.notFound,msg:'密码错误'}}
    let id = result[0].id;
    [err,result] = await handle(db_user.changePasswd(id,newPasswd));
    if(err)throw err;
    return;
}

/**
 * 修改指定账户的手机号
 * @param type
 * @param account
 * @param passwd
 * @param newPhone
 * @returns {Promise<void>}
 */
async function changePhone(type,account,passwd,newPhone){
    // 根据账号和原密码查找id
    let [err,result] = await handle(db_user.login(type,account,passwd));
    if(err)throw err;
    if (result.length < 1 ) {throw {rcode:codeMap.notFound,msg:'密码错误'}}
    // 查看是否有对应的手机号
    let id = result[0].id;
    [err,result] = await handle(db_user.findPhoneUser(type,newPhone));
    if(err)throw err;
    if(result[0].total){throw {rcode:codeMap.dataRepeat,msg:'手机号已经使用'}}
    // 修改手机号
    [err,result] = await handle(db_user.changePhone(id,newPhone));
    if(err)throw err;
    return result;
}

/**
 * 用户注册
 * @param type
 * @param account
 * @param passwd
 * @param nickName
 * @returns {Promise<void>}
 */
async function register(type,account,passwd,nickName){
    // 根据账号和原密码查找id
    let [err,result] = await handle(db_user.findAccountUser(type,account));
    if(err)throw err;
    if(result.length&&result[0].total){throw {rcode:codeMap.dataRepeat,msg:'账号重复'}}
    // 新增用户
    [err,result] = await handle(db_user.register(type,nickName,account,passwd));
    if(err)throw err;
    // 注册成功
    return result;
}

/**
 * 加载用户信息
 * @param type
 * @param account
 * @returns {Promise<void>}
 */
async function info(type,account){
    // 根据账号和原密码查找id
    let [err,result] = await handle(db_user.info(type,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    // 注册成功
    return result[0];
}

/**
 * 获取用户购物车
 * @param account 用户账号
 * @returns {Promise<*>}
 */
async function cars(account){
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    [err,result] = await handle(db_user.cars(result[0].id));
    if(err)throw err;
    // 注册成功
    return result;
}


async function removeCar(carId){
    let [err,result] = await handle(db_user.removeCar(carId));
    if(err)throw err;
    return result;
}

/**
 * 移除乘机人
 * @param travelId
 * @returns {Promise<*>}
 */
async function removeTravel(travelId){
    let [err,result] = await handle(db_user.removeTravel(travelId));
    if(err)throw err;
    return result;
}

/**
 * 添加乘机人
 * @param name 乘机人名
 * @param card 身份证号
 * @param phone 手机号
 * @param account 登陆账号
 * @param isDefault 是否为默认
 * @returns {Promise<*>}
 */
async function addTravel(name,card,phone,account,isDefault = field.travelState_isDefault){
    let userId;
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    userId = result[0].id;
    [err,result] = await handle(db_user.changeAllTravelState(userId,field.travelState_notDefault));
    if(err)throw err;
    // 开始添加购物车
    [err,result] = await handle(db_user.addTravel(userId,name,card,phone,isDefault));
    if(err)throw err;
    return result;
}

async function updateTravel(account,travelId,params){
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    [err,result] = await handle(db_user.changeTravel(travelId,{
        card:params.card,
        phone:params.phone,
        default:params.default
    }));
    if(err)throw err;

    // 查找成功
    return result;
}

/**
 * 查找所有的乘机人
 * @param account
 * @returns {Promise<*>}
 */
async function travels(account){
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    [err,result] = await handle(db_user.travels(result[0].id));
    if(err)throw err;

    // 查找成功
    return result.map(val=>{
        let card = val.card.replace(val.card.substr(4,10),'**********')
        return {
            ...val,
            card:card
        }
    });
}

/**
 * 乘机人详细信息
 * @param account
 * @param passwd
 * @param travelId
 * @returns {Promise<*>}
 */
async function travelInfo(account,passwd,travelId){
    // 根据账号查找id
    let [err,result] = await handle(db_user.login(userType,account,passwd));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    [err,result] = await handle(db_user.travelInfo(travelId));
    if(err)throw err;
    return result;
}

async function addCar(flightId,account){
    let userId;
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    userId = result[0].id;
    // 查看航班是否已经结束
    [err,result] = await handle(d_air.flightInfo(flightId));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到航班,航班号错误'}
    }
    console.log(result[0]);
    if(result[0].flightState !== field.flightState_sail+''){
        throw {rcode:codeMap.customError,msg:'航班非销售状态'}
    }
    [err,result] = await handle(db_user.findCar(userId,flightId));
    if(err)throw err;
    if(result.length >= 1){
        throw {rcode:codeMap.customError,msg:'该航班已经在购物车中'}
    }
    // 开始添加购物车
    [err,result] = await handle(db_user.addCar(flightId,userId));
    if(err)throw err;
    return result;
}


async function addOrder(){

}

module.exports = {
    register,
    changePhone,
    changePasswd,
    checkAccount,
    login,
    info,
    removeCar,
    addCar,
    cars,
    removeTravel,
    addTravel,
    travels,
    travelInfo,
    updateTravel
}

