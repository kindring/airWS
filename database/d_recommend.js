const mysql = require('./mysql')
const field = require('../maps/field')
const code = require('../maps/rcodeMap')
const checkArgumentsIsEmpty = require('../until/checkArgumentsIsEmpty')

/**
 * 新增活动
 * @param recommendName 活动名
 * @param discript 推荐描述
 * @param zIndex 排序
 * @param imgUrl
 * @returns {Promise | Promise<unknown>}
 */
function addRecommend(recommendName,discript,zIndex = 1,imgUrl = 'public/upload/bg_weekend.jpg'){
    let sql=``,values=[];
    sql+=`insert into 
            recommendDir (recommendName,discript,zIndex,bg) 
            values(?,?,?,?);`
    values.push(recommendName,discript,zIndex,imgUrl)
    return mysql.pq(sql,values);
}

/**
 * 活动列表
 * @returns {Promise | Promise<unknown>}
 */
function recommendList(){
    let sql=``,values=[];
    sql+=`select * from recommendDir`
    sql += ' order by zIndex desc;'
    return mysql.pq(sql,values);
}


/**
 * 获取活动
 * @param recommendId 活动id
 * @returns {Promise | Promise<unknown>}
 */
function find(recommendId){
    let sql=``,values=[];
    sql+=`select * from recommendDir where id = ?`;
    sql += ';';
    values.push(recommendId);
    return mysql.pq(sql,values);
}

/**
 * 搜索活动
 * @param key
 * @param state
 * @returns {Promise<unknown>}
 */
function searchRecommend(key,state){
    let sql=``,values=[];
    sql+=`select * from recommendDir`
    if(key){
        sql += ` where recommend like "%?%" and discript like "%?%"`
        values.push(key,key)
    }
    if(state){
        if(values.length < 1){
            sql += ' where'
        }
        sql += ` state = state`
        values.push(state)
    }
    sql += ';'
    // values.push(recommendName,discript,zIndex)
    return mysql.pq(sql,values);
}

/**
 * 加载所有航班
 * @param recommendId 航班id
 * @param isHave 是否为在指定航班中
 * @returns {Promise<unknown>}
 */
function loadFlights(recommendId,isHave){
    let sql=``,values=[];
    sql+=`select r.*,f.flightName,f.currentPrice,f.originalPrice,f.sailingTime,f.langdinTime ,air.airCode,dep.cityname as departureCityName,tar.cityname as targetCityName
            from
            recommendFlight as r,
            flight as f
            LEFT JOIN (select * from air ) as air on air.id = f.airId
            LEFT JOIN (select id,cityName from area ) as dep on dep.id = f.departureCity
            LEFT JOIN (select id,cityName from area ) as tar on tar.id = f.targetCity where`
    if(isHave){
        sql += ` f.id = r.flightId`;
    }else {
        sql += ` f.id != r.flightId and f.flightState = 1`;
    }
    sql += ` and r.recommendId = ?`;
    values.push(recommendId);
    sql += ' order by r.zIndex desc;'
    return mysql.pq(sql,values);
}

/**
 * 活动添加航班
 * @param recommendId 活动id
 * @param flights 航班列表
 * @returns {Promise<unknown>}
 */
function addFlights(recommendId,flights){
    let sql=``,values=[];
    sql+=`insert into area (recommendId,flightId,recommendIndex) values`
    for (let i = 0;i<flights.length;i++){
        if(i>0){
            sql+=',';
        }
        sql+=`(?,?,?)`;
        values.push(recommendId,flights.flightId,flights.recommendIndex);
    }
    sql += ';'
    return mysql.pq(sql,values);
}

/**
 * 新增航班到推荐中
 * @param recommendId
 * @param flightId
 * @param img
 * @param zIndex
 * @returns {Promise | Promise<unknown>}
 */
function addFlight(recommendId,flightId,img,zIndex = 0){
    let sql=``,values=[];
    sql+=`insert into recommendFlight (recommendId,flightId,img,zIndex) values(?,?,?,?)`
    values.push(recommendId,flightId,img,zIndex)
    sql += ';'
    return mysql.pq(sql,values);
}

/**
 * 删除推荐里的指定航班
 * @param recommendId 推荐id
 * @param flightId 航班id
 */
function deleteFlight(recommendId,flightId){
    let sql=``,values=[];
    sql+=`delete from recommendFlight where recommendId = ? and flightId = ?`
    values.push(recommendId,flightId);
    sql += ';'
    return mysql.pq(sql,values);
}




function updateRecommend(recommendId,params){
    let sql=`update recommendDir set`,values=[];
    let fields = Object.keys(params);
    fields = fields.filter(field=>params[field])
    if(fields.length<1){
        throw {rcode:code.notParam,msg:'db缺少参数'}
    }
    for(let field of fields) {
        if (!params[field]) {
            continue;
        }
        if(values.length>0){sql+=','}
        sql+=` \`${field}\` = ?`
        values.push(params[field])
    }
    sql+=` where id = ?`;
    values.push(recommendId);
    return mysql.pq(sql,values);
}

/**
 * 更新活动项
 * @param recommendId
 * @param flightId
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
function updateRecommendItem(recommendId,flightId,params){
    let sql=`update recommendFlight set`,values=[];
    let fields = Object.keys(params);
    fields = fields.filter(field=>params[field])
    if(fields.length<1){
        throw {rcode:code.notParam,msg:'db缺少参数'}
    }
    console.log(fields)
    console.log(params)
    for(let field of fields) {
        if (!params[field]) {
            continue;
        }
        if(values.length>0){sql+=','}
        sql+=` \`${field}\` = ?`
        values.push(params[field])
    }
    sql+=` where recommendId = ? and flightId = ?`;
    values.push(recommendId,flightId);
    return mysql.pq(sql,values);
}

module.exports = {
    recommendList,
    addRecommend,
    searchRecommend,
    loadFlights,
    addFlights,
    addFlight,
    deleteFlight,
    updateRecommend,
    updateRecommendItem,
    find
}
