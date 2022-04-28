module.exports = {
    // 普通用户状态
    userType:1,
    // 管理员账户
    adminType:2,
    // 用户表正常状态
    userNomalState: 1,
    // 用户表封禁状态
    userFreezeState:2,
    // 用户注销状态
    userStopState: 3,
    // 国内航班
    routeType_domestic:1,
    // 国际航班
    routeType_international:2,
    // 国内城市
    cityType_domestic:1,
    // 国际城市
    cityType_international:2,
    // 航班售票中
    flightState_sail: 1,
    // 航班检票状态
    flightState_wicket:2,
    // 设置
    travelState_isDefault: 1,
    travelState_notDefault: 2,
    // 未删除的乘机人
    travelDelete_notDelete: 2,
    // 订单已经创建,暂时未支付
    payState_create: 1,
    // 已经支付
    payState_pay: 2,
    // 已经全部值机
    payState_choose: 3,
    // 订单结束
    payState_end: 4,
    // 订单取消
    payState_cancel: 5,
    // 全部退款
    payState_refund: 6,
    // 部分机票退款
    payState_rebates: 7,
    // 超时取消
    payState_timeout: 8,
    // 机票创建
    tickState_create: 1,
    // 已经值机
    tickState_seat: 2,
    // 行程结束
    tickState_wait: 3,
    // 机票已经退款
    tickState_refund: 4,
    // 全部订单
    orderType_all:'all',
    // 等待支付
    orderType_waitPay:'waitPay',
    // 已经支付订单
    orderType_pay:'pay',
    // 已经结束订单
    orderType_end:'end',
    // 已经取消订单
    orderType_cancel:'cancel',
}
