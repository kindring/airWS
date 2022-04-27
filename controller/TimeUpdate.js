// 自动更新数据库的支付状态
const {getUnixTimeStamp} = require('../until/time')
const db_user = require('../database/d_user')
const handle = require("../until/handle");
let orders = [];

// 订单超过15分钟的自动过期
let expire = 60 * 15;
let timerHandle = null;

// 每隔5秒遍历一次数据
async function loadOrders(now,){
    let [err,result] = await handle(db_user.waitPayOrder());
}

async function tick (){


}


function check(order){

}


console.log('检测订单')
tick();
