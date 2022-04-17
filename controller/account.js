const db_user = require('../database/d_user')
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

module.exports = {
    register,
    changePhone,
    changePasswd,
    checkAccount,
    login,
    info
}

