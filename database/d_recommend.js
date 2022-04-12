const mysql = require('./mysql')
const field = require('../maps/field')
const code = require('../maps/rcodeMap')
const checkArgumentsIsEmpty = require('../until/checkArgumentsIsEmpty')

/**
 * 新增活动
 * @param recommendName 活动名
 * @param discript 推荐描述
 * @param zIndex 排序
 * @returns {Promise | Promise<unknown>}
 */
function addRecommend(recommendName,discript,zIndex = 1){
    let sql=``,values=[];
    sql+=`insert into 
            recommend (recommendName,discript,zIndex) 
            values(?,?,?);`
    values.push(recommendName,discript,zIndex)
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
    sql+=`select f.*,r.recommendIndex from flight as f , recommendFlight as r  where`
    if(isHave){
        sql += ` f.id = r.flightId`;
    }else {
        sql += ` f.id != r.flightId`;
    }
    sql += ` and r.recommendId = ?`;
    values.push(recommendId);
    sql += ';'
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

module.exports = {
    addRecommend,
    searchRecommend,
    loadFlights,
    addFlights,
    deleteFlight,
}