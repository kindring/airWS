const mysql = require('./mysql');

/**
 * 查找是否有指定用户名的账户
 * @param userType 用户类型
 * @param account 账号
 * @returns {Promise<unknown>}
 */
function findAccountUser(userType,account){
    let sql = `select count(*) as total from user where type = ? and account = ?`;
    let values = [userType,account];
    return mysql.pq(sql,values);
}

/**
 * 查找是否手机号是否被绑定
 * @param userType 用户类型
 * @param phone 手机号
 * @returns {Promise<unknown>}
 */
function findPhoneUser(userType,phone){
    let sql = `select count(*) as total from user where type = ? and phone = ?`;
    let values = [userType,phone];
    return mysql.pq(sql,values);
}

/**
 * 登录
 * @param userType
 * @param account
 * @param passwd
 * @returns {Promise<unknown>}
 */
function login(userType,account,passwd){
    let sql = `select * from user where accountType = ? and account = ? and passwd = ?`;
    let values = [...arguments];
    return mysql.pq(sql,values);
}


/**
 * 根据id修改密码
 * @param id
 * @param newPasswd
 * @returns {Promise<unknown>}
 */
function  changePasswd(id,newPasswd){
    let sql = `update user set passwd = ? where id = ?`;
    let values = [newPasswd,id];
    return mysql.pq(sql,values);
}

/**
 * 修改账号手机号
 * @param id
 * @param phone
 * @returns {Promise<unknown>}
 */
function changePhone(id,phone){
    let sql = `update user set Phone = ? where id = ?`;
    let values = [phone,id];
    return mysql.pq(sql,values);
}

/**
 * 新增用户
 * @param userType 账户类型
 * @param nickName 用户名称
 * @param account 登录账号
 * @param passwd 密码
 * @returns {Promise<unknown>}
 */
function register(userType,nickName,account,passwd){
    let sql = `insert into user(nickName,account,passwd,type) values(?,?,?,?)`;
    let values = [newPasswd,id];
    return mysql.pq(sql,values);
}

module.exports =  {
    register,
    login,
    findAccountUser,
    findPhoneUser,
    changePhone,
    changePasswd
}