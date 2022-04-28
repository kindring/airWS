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
    // 已经选坐
    payState_choose: 3,
    // 订单结束
    payState_end: 4,
    // 订单取消
    payState_cancel: 5,
    // 全部退款
    payState_refund: 6,
    // 部分机票退款
    payState_rebates: 7,
}
