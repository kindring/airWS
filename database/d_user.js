const mysql = require('./mysql');
const fields = require("../maps/field")
const code = require("../maps/rcodeMap");
/**
 * 查找是否有指定用户名的账户
 * @param userType 用户类型
 * @param account 账号
 * @returns {Promise<unknown>}
 */
function findAccountUser(userType,account){
    let sql = `select * from user where accountType = ? and account = ?`;
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
    let sql = `select count(*) as total from user where accountType = ? and phone = ?`;
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
    let sql = `insert into user(nickName,account,passwd,accountType) values(?,?,?,?)`;
    let values = [nickName,account,passwd,userType];
    return mysql.pq(sql,values);
}

function info(type,account){
    let sql = `select * from user where accountType = ? and account = ?`;
    let values = [type,account];
    return mysql.pq(sql,values);
}


function findCar(userId,flightId){
    let sql = ``,values = [];
    sql = `select c.*,f.flightState,f.currentPrice,f.sailingTime,f.langdinTime,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            inner JOIN (select * from car ) as c on c.flightId = f.id
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity
            where c.userId = ? and flightId = ?;`
    values.push(userId,flightId);
    return mysql.pq(sql,values);
}

function cars(userId){
    let sql = ``,values = [];
    sql = `select c.*,f.flightState,f.currentPrice,f.sailingTime,f.langdinTime,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            flight as f
            inner JOIN (select * from car ) as c on c.flightId = f.id
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity
            where c.userId = ?;`
    values.push(userId);
    return mysql.pq(sql,values);
}


function addCar(flightId,userId){
    let sql = `insert into car(flightId,userId) values(?,?)`;
    let values = [flightId,userId];
    return mysql.pq(sql,values);
}

/**
 * 添加乘机人
 * @param userId
 * @param name
 * @param card
 * @param phone
 * @param defaultState
 * @returns {Promise | Promise<unknown>}
 */
function addTravel(userId,name,card,phone,defaultState){
    let sql = `insert into travel(userId,name,card,phone,\`default\`) values(?,?,?,?,?)`;
    let values = [userId,name,card,phone,defaultState];
    return mysql.pq(sql,values);
}
// 获取乘机人
function travels(userId){
    let sql = `select * from travel where userId = ? and \`delete\` = ?`;
    let values = [userId,fields.travelDelete_notDelete];
    return mysql.pq(sql,values);
}

// 获取乘机人
function findUserTravel(userId,flightId){
    let sql = `select * from travel where userId = ? and id = ?`;
    let values = [userId,flightId];
    return mysql.pq(sql,values);
}
/**
 * 修改指定用户的所有状态
 * @param userId
 * @param travelState
 * @returns {Promise | Promise<unknown>}
 */
function changeAllTravelState(userId,travelState = fields.travelState_notDefault){
    let sql = `update travel set \`default\` = ? where userId = ?`;
    let values = [travelState,userId];
    return mysql.pq(sql,values);
}

/**
 * 修改指定乘机人的信息
 * @param travelId
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function changeTravel(travelId,params){
    let sql=`update travel set`,values=[];
    let fields = Object.keys(params);
    fields = fields.filter(field=>params[field])
    if(fields.length<1){
        throw {rcode:code.notParam}
    }
    for(let field of fields) {
        // console.log(`${field} : ${searchItems[field]}`)
        if (!params[field]) {
            continue;
        }
        if(values.length>0){sql+=','}
        sql+=` \`${field}\` = ?`
        values.push(params[field])
    }
    sql+=` where id=?`;
    values.push(travelId)
    // let sql = `update travel set default = ? where userId = ?`;
    // let values = [travelState,userId];
    return mysql.pq(sql,values);
}

// 修改乘机人
function removeTravel(travelId){
    let sql = `update travel set travel.delete = ? where travelId =?`;
    let values = [fields.travelDelete_notDelete,travelId];
    return mysql.pq(sql,values);
}


// 修改乘机人
function travelInfo(travelId){
    let sql = `select * from travel where id = ?`;
    let values = [travelId];
    return mysql.pq(sql,values);
}


/**
 * 移除购物车的指定行 根据id
 * @param carId 要删除的id
 * @returns {Promise<unknown>}
 */
function removeCar(carId){
    let sql = `delete from car where id = ?`;
    let values = [carId];
    return mysql.pq(sql,values);
}


function userOrder(userId,payState){
    let sql=``,values=[];
    sql+=`
        select 
        o.*,air.airCode,
        f.sailingTime,f.langdinTime,f.flightState,f.flightName,
        dep.cityname as departureCityName,
        tar.cityname as targetCityName
        from 
        orders as o 
        LEFT JOIN (select * from flight ) as f on f.id = o.flightId
        LEFT JOIN (select * from air ) as air on air.id = f.airId
        LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
        LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity;
        where userId = ?
       `
    values.push(userId);
    if (payState){
        sql+=` and payState = ?`;
        values.push(payState);
    }
    return mysql.pq(sql,values);
}

// 获取
function orderTick(orderId){
    let sql=``,values=[];
    sql+=`select * from airTicket where orderId = ?`;
    values.push(orderId);
    return mysql.pq(sql,values);
}

/**
 * 获取机票信息
 * @param tickId 机票id
 * @returns {Promise | Promise<unknown>}
 */
function tickInfo(tickId){
    let sql=``,values=[];
    sql+=`select * from airTicket where id = ?`;
    values.push(tickId);
    return mysql.pq(sql,values);
}

/**
 * 添加选票
 * @param orderId
 * @param travelId
 * @returns {Promise | Promise<unknown>}
 */
function addTick(orderId,travelId){
    let sql=``,values=[];
    sql+=`insert into order(orderId,travelId) values(?,?)`;
    values.push(orderId,travelId);
    return mysql.pq(sql,values);
}

/**
 * 清除指定订单的所有票
 * @param orderId
 * @returns {Promise | Promise<unknown>}
 */
function clearTick(orderId){
    let sql=``,values=[];
    sql+=`delete from order where orderId = ?`;
    values.push(orderId);
    return mysql.pq(sql,values);
}

function addOrder(userId,flightId,travelIds,createTime){
    let sql=``,values=[];
    sql+=`insert into order(userId,flightId,ticketNum,travelIds,createTime) values(?,?,?,?,?)`;
    values.push(userId,flightId);
    values.push(travelIds.length);
    values.push(travelIds.join(','));
    values.push(createTime);
    return mysql.pq(sql,values);
}

/**
 * 用户支付订单
 * @param orderId
 * @returns {Promise | Promise<unknown>}
 */
function payOrder(orderId){
    let sql=``,values=[];
    sql+=`update orders set payState = ? where id = orderId`
    values.push(fields.payState_pay,orderId);
    return mysql.pq(sql,values);
}

/**
 * 获取平台上所有等待支付的订单
 * @returns {Promise | Promise<unknown>}
 */
function waitPayOrder(){
    let sql=``,values=[];
    sql+=`select * from orders where payState = ?`
    values.push(fields.payState_create);
    return mysql.pq(sql,values);
}

/**
 * 修改订单信息
 * @param orderId
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function changeOrder(orderId,params){
    let sql=`update orders set`,values=[];
    let fields = Object.keys(params);
    fields = fields.filter(field=>params[field])
    if(fields.length<1){
        throw {rcode:code.notParam}
    }
    for(let field of fields) {
        if (!params[field]) {
            continue;
        }
        if(values.length>0){sql+=','}
        sql+=` \`${field}\` = ?`
        values.push(params[field])
    }
    sql+=` where id=?`;
    values.push(orderId)
    return mysql.pq(sql,values);
}

/**
 * 获取指定用户的对应订单详细信息
 * @param userId
 * @param orderId
 * @returns {Promise | Promise<unknown>}
 */
function userOrderInfo(userId,orderId){
    let sql=``,values=[];
    sql+=`select * from orders where userId = ? and orderId = ?`
    values.push(userId,orderId);
    return mysql.pq(sql,values);
}

module.exports =  {
    register,
    login,
    findAccountUser,
    findPhoneUser,
    changePhone,
    changePasswd,
    info,
    cars,
    removeCar,
    addCar,
    findCar,
    removeTravel,
    addTravel,
    travels,
    findUserTravel,
    travelInfo,
    changeAllTravelState,
    changeTravel,
    waitPayOrder,
    changeOrder,
    payOrder,
    addOrder,
    userOrderInfo,
    addTick,
    clearTick,
    tickInfo
}
