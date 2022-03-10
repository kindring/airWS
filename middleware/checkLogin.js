/*
 * @Description: 检查用户是否已经登陆
 * @Autor: kindring
 * @Date: 2021-12-22 16:24:37
 * @LastEditors: kindring
 * @LastEditTime: 2022-01-26 14:07:50
 * @LastDescript: 
 */
const codeMap = require('../maps/rcodeMap');
/**
 * 检查是否登录
 * @param {'json'|'view'} type 返回的数据类型
 * @returns 
 */
function checkLogin(type = 'json') {
    return function(req, res, next) {
        console.log('检查是否有登陆');
        if (!req.session.owner) {
            // 类型
            let resAction;
            switch (type) {
                case 'view':
                    resAction = {
                        action: 'redirect',
                        params: [302, '/login']
                    }
                    break;
                case 'json':
                default:
                    resAction = {
                        action: 'json',
                        params: [{
                            rcode: codeMap.notLogin,
                            msg: 'not login'
                        }]
                    }
                    break;
            }
            return res[resAction.action](...resAction.params)
        }
        next();
    }
}


module.exports = checkLogin;