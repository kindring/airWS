/*
 * @Description: 检查用户是否已经登陆
 * @Autor: kindring
 * @Date: 2021-12-22 16:24:37
 * @LastEditors: kindring
 * @LastEditTime: 2022-01-26 14:07:50
 * @LastDescript: 
 */
const codeMap = require('../maps/rcodeMap');
const progress = require('../maps/progress');
/**
 * 检查是否登录
 * @param accountType 账户类型
 * @param {'json'|'view'} type 返回的数据类型
 * @returns
 */
function checkLogin(accountType,type = 'json') {
    return function(req, res, next) {
        let field,redirectPath = progress.userLoginUrl;
        switch (accountType) {
            case 2:
                field = progress.adminSessionField;
                redirectPath = progress.adminLoginUrl;
                break;
            case 1:
            default:
                field = progress.userSessionField;
        }
        let tmpAccount = req.session[field];
        req.session[field] = '';
        if (!tmpAccount) {
            // 类型
            let resAction;
            switch (type) {
                case 'view':
                    resAction = {
                        action: 'redirect',
                        params: [302, redirectPath]
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
        req.session[field] = tmpAccount;
        next();
    }
}


module.exports = checkLogin;
