// 自动更新数据库的支付状态
const {getUnixTimeStamp} = require('../until/time')
const db_user = require('../database/d_user')
const handle = require("../until/handle");
const {payState_cancel} = require("../maps/field");
let orders = [];
let payLock = false;
// 订单超过15分钟的自动过期
let expire = 60 * 15;
let timerHandle = null;


function tick (t,fn){
    setTimeout(async ()=>{
        await fn();
        tick(t,fn);
    },t)
}

async function loadOrder(){
    let [err,result] = await handle(db_user.waitPayOrder());
    if(err){
        console.log('获取用户数据失败')
        console.error(err);
    }
    orders = result.map(order=>{
        return {
            id: order.id,
            endTime: parseInt(order.createTime) + expire
        }
    });
}

async function check(){
    if(payLock){
        return;
    }
    let nowUnix = getUnixTimeStamp();
    orders = orders.filter(val=>val);
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        if(!order){
            break;
        }
        if(nowUnix>order.endTime){
            let [err,result] = await handle(db_user.changeOrder(order.id,{payState:payState_cancel}));
            if(err){console.log(err)}else{
                console.log(`订单${order.id},超时过期`);
                orders[i] = null;
            }

        }
    }
}

async function main(){
    console.log('检测订单');
    tick(1000,check);
}
main();

// 用户支付订单
async function payOrder(orderId){
    payLock=true;
    let [err,result] = await handle(db_user.payOrder(orderId));
    if(err){payLock=false;console.log(err);throw err}
    let ind = orders.findIndex(val=>val.id==orderId);
    if(ind!=-1){orders[ind] = null}
    orders = orders.filter(val=>val);
    payLock=false;
    return result;
}


async function reloadOrder(){
    payLock=true;
    await loadOrder();
    payLock=false;
}

module.exports = {
    reloadOrder,
    payOrder,
}

