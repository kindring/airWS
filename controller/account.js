const db_user = require('../database/d_user')
const d_air = require('../database/d_air')
const c_flight = require('./c_flight');
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')
const {userType, orderType_all} = require("../maps/field");
const {getUnixTimeStamp} = require("../until/time");
// 更新订单
const {reloadOrder, payOrderItem} = require("./TimeUpdate");
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
    return result[0];
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
    // 用户信息
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
    // 开始添加乘客
    [err,result] = await handle(db_user.addTravel(userId,name,card,phone,isDefault));
    if(err)throw err;
    return result;
}

/**
 * 更改乘车人信息
 * @param account
 * @param travelId
 * @param params
 * @returns {Promise<*>}
 */
async function updateTravel(account,travelId,params){
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    // 根据账户与id查找乘车人
    [err,result] = await handle(db_user.findUserTravel(result[0].id,travelId));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法匹配用户的乘车人'}
    }
    [err,result] = await handle(db_user.changeTravel(travelId,{
        name:params.name,
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
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到乘车人'}
    }
    return result[0];
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

/**
 * 获取指定用户的订单
 * @param account
 * @param orderType
 * @returns {Promise<*>}
 */
async function orders(account,orderType){
    // 获取订单详情
    let err,user,result;
    [err,user] = await handle(info(userType,account));
    if(err)throw err;
    console.log(orderType);
    // 获取账户
    [err,result] = await handle(db_user.userOrder(user.id,orderType));
    if(err)throw err;
    return result;
}

/**
 * 新建订单
 * @param account
 * @param flightId
 * @param travelIds
 * @returns {Promise<*>}
 */
async function addOrder(account,flightId,travelIds){
    let flight,err,result;
    if(travelIds.length < 1){throw {rcode:codeMap.notParam,msg:'缺少乘车人'}}
    // 检查是否有不知名的乘机人
    for(let i = 0;i<travelIds.length;i++){
        [err,result] = await handle(db_user.travelInfo(travelIds[0]));
        if(err)throw err;
        if(result.length<1){throw {rcode:codeMap.customError,msg:'不在数据表的乘机人'}}
    }
    let userId,unixTime = getUnixTimeStamp();
    // 根据账号查找id
   [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    userId = result[0].id;
    // 查看航班是否已经结束
    [err,flight] = await handle(c_flight.flightInfo(flightId));
    if(err)throw err;
    if((parseInt(flight.pay) + travelIds.length) > parseInt(flight.totalVotes)){
        throw {rcode:codeMap.customError,msg:'航班机票不足'}
    }
    if(flight.flightState != field.flightState_sail){
        throw {rcode:codeMap.customError,msg:'该航班已经结束售卖'}
    }
    // 添加订单
    [err,result] = await handle(db_user.addOrder(userId,flightId,travelIds,unixTime));
    if(err)throw err;
    await reloadOrder();
    // 添加订单
    [err,result] = await handle(db_user.findOrder(userId,flightId,travelIds,unixTime));
    if(err)throw err;
    return result[0]||{};
}

// 退票订单
async function refundOrder(account,orderId){
    let userId,order,ticks,isRefund = false;
    // order.travelIds = undefined;
    // 根据账号查找id
    let [err,result] = await handle(info(userType,account));
    if(err)throw err;
    userId = result.id;
    [err,result] = await handle(db_user.userOrderInfo(userId,orderId));
    if(err)throw err;
    if(result.length < 1){ throw {rcode:codeMap.notFound,msg:'无法找到相关订单'} }
    order = result[0];
    // 获取所有车票信息,只有在已经支付后才有
    [err,ticks] = await handle(db_user.orderTicks(order.id));
    if(err)throw err;
    // 判断是否有机票已经退款了
    for (const tick of ticks) {
        if(tick.tickState == field.tickState_seat){
            throw {rcode:codeMap.customError,msg:'该订单部分机票已经值机不允许退票'}
        }
    }
    // 订单设置为退票状态
    [err,result] = await handle(db_user.changeOrder(orderId, {payState:field.payState_refund}));
    if(err)throw err;
    // 退票所有乘客
    [err,result] = await handle(db_user.refundOrderTick(orderId));
    if(err)throw err;
    return result;
}

/**
 * 支付订单
 * @param account 账户
 * @param passwd
 * @param orderId 订单id
 * @returns {Promise<boolean>}
 */
async function payOrder(account,passwd,orderId){
    let userId,order,flight,travels;
    // order.travelIds = undefined;
    // 根据账号查找id
    let [err,result] = await handle(login(userType,account,passwd));
    if(err)throw err;
    userId = result.id;
    [err,result] = await handle(db_user.userOrderInfo(userId,orderId));
    if(err)throw err;
    if(result.length < 1){ throw {rcode:codeMap.notFound,msg:'无法找到相关订单'} }
    order = result[0];
    if(order.payState!=field.payState_create){throw {rcode:codeMap.notFound,msg:'无法支付非未支付订单'}}
    [err,flight] = await handle(c_flight.flightInfo(order.flightId));
    if(err)throw err;
    if(flight.flightState!=field.flightState_sail){throw {rcode:codeMap.notFound,msg:'航班已经开始检票或者起飞,无法支付'}}
    // 创建对应的机票
    travels=order.travelIds.split(',');
    for(let i = 0;i<travels.length;i++){
        // 添加乘机人
        [err,result] = await handle(db_user.addTick(order.id,travels[i]));
        if(err){
            // 删除对应订单的乘机人
            [err,result] = await handle(db_user.clearTick(order.id));
        }
    }
    let unitPrice = parseFloat(flight.currentPrice);
    let payPrice = parseFloat(flight.currentPrice) * travels.length;
    [err,result] = await handle(db_user.payOrder(orderId,unitPrice,payPrice,getUnixTimeStamp()));
    if(err){console.log(err);throw err}
    await reloadOrder();
    return result;
}

/**
 * 选坐
 * @param account
 * @param tickId 机票id
 * @param row 排
 * @param col 行
 * @returns {Promise<void>}
 */
async function chooseSit(account,tickId,row,col){
    let tick,order,travels;
    // 获取对应的航班信息
    let [err,result] = await handle(db_user.tickInfo(tickId))
    if(err)throw err;
    if(result.length < 1){throw {rcode:codeMap.notFound,msg:'无法找到机票'}}
    tick = result[0];
    [err,order] = await handle(orderInfo(account,tick.orderId))
    if(err)throw err;
    // 查看指定航班指定位置的票是否被选中
    [err,result] = await handle(db_user.findTickRowCol(order.flightId,row,col))
    if(err)throw err;
    if(result.length > 0){throw {rcode:codeMap.dataRepeat,msg:'该位置已经被占用了呢'}}
    // 设置座位
    [err,result] = await handle(db_user.tickChooseToSel(tickId,row,col,getUnixTimeStamp()))
    if(err)throw err;
    // 遍历查看订单是否全部选坐完成.全部选坐完成则
    travels=order.travelIds.split(',');
    [err,result] = await handle(db_user.tickSearch({
        orderId: order.id,
        tickState: field.tickState_seat
    }));
    if(err) {throw err}
    // 已经全部值机,订单切换为全部值机的状态
    if(result.length === travels.length){
        [err,result] = await handle(db_user.changeOrder(order.id,{payState:field.payState_choose,chooseNum:result.length}));
        if(err) {throw  err}
    }else{
        // 添加已经选坐的乘客数量
        [err,result] = await handle(db_user.changeOrder(order.id,{chooseNum:result.length}));
        if(err) {throw  err}
    }
    return result;
}

/**
 * 退款机票
 * @param account
 * @param tickId
 * @returns {Promise<*>}
 */
async function refundTick(account,tickId){
    let tick,order,travels;
    // 获取对应的航班信息
    let [err,result] = await handle(db_user.tickInfo(tickId))
    if(err)throw err;
    if(result.length < 1){throw {rcode:codeMap.notFound,msg:'无法找到机票'}}
    tick = result[0];

    if(tick.tickState != field.tickState_create){throw {rcode:codeMap.customError,msg:'该机票不允许退款'}}
    // 退款订单
    [err,result] = await handle(db_user.refundTick(tickId))
    if(err)throw err;
    // 查看对应的订单状态
    [err,order] = await handle(orderInfo(account,tick.orderId))
    if(err)throw err;
    // 遍历查看订单是否为部分退款
    travels=order.travelIds.split(',');
    [err,result] = await handle(db_user.tickSearch({
        orderId: order.id,
        tickState: field.tickState_refund
    }));
    if(err) {throw err}
    // 是否已经全部退款
    if(result.length === travels.length){
        [err,result] = await handle(db_user.changeOrder(order.id,{payState:field.payState_refund}));
        if(err) {throw  err}
    }else{
        [err,result] = await handle(db_user.changeOrder(order.id,{payState:field.payState_rebates}));
        if(err) {throw  err}
    }
    return result;
}

/**
 * 订单详情
 * @param account
 * @param orderId
 * @returns {Promise<void>}
 */
async function orderInfo(account,orderId){
    let userId,order,travels,ticks,tmpTravels=[];
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    userId = result[0].id;
    [err,result] = await handle(db_user.userOrderInfo(userId,orderId));
    if(err)throw err;
    if(result.length < 1){ throw {rcode:codeMap.notFound,msg:'无法找到相关订单'} }
    order = result[0];
    // 获取所有车票信息,只有在已经支付后才有
    [err,ticks] = await handle(db_user.orderTicks(orderId));
    order.ticks = ticks
    // 获取乘车人信息
    travels=order.travelIds.split(',');
    for (let i = 0; i < travels.length ; i++) {
        [err,result] = await handle(db_user.travelInfo(travels[i]));
        if(err) {console.log('获取乘车人信息失败'); throw  err}
        if(result.length < 1){ throw {rcode:codeMap.notFound,msg:'无法找到乘车人'} }
        console.log(result);
        tmpTravels.push({
            id:result[0].id,
            name:result[0].name,
        })
    }
    order.travels = tmpTravels;
    return order;
}

/**
 * 修改订单乘机人
 * @param account
 * @param orderId
 * @param travelIds
 * @returns {Promise<void>}
 */
async function changeOrderTravel(account,orderId,travelIds){
    let userId,order,travels;
    // 根据账号查找id
    let [err,result] = await handle(db_user.findAccountUser(userType,account));
    if(err)throw err;
    if(result.length < 1){
        throw {rcode:codeMap.notFound,msg:'无法找到账户'}
    }
    [err,result] = await handle(db_user.userOrderInfo(userId,orderId));
    if(err)throw err;
    if(result.length < 1){ throw {rcode:codeMap.notFound,msg:'无法找到相关订单'} }
    order = result[0];
    // 只允许未选坐前进行修改乘客信息
    if(order.payState == field.payState_create || order.payState == field.payState_pay){

    }else{
        throw {rcode:codeMap.notFound,msg:'当前订单不允许修改乘车人'}
    }
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
    updateTravel,
    orders,
    addOrder,
    chooseSit,
    payOrder,
    orderInfo,
    refundTick,
    refundOrder,
    changeOrderTravel
}

