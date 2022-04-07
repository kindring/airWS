/*
 * @Description: 参数验证中间件
 * @Autor: kindring
 * @Date: 2022-01-24 11:02:16
 * @LastEditors: kindring
 * @LastEditTime: 2022-02-14 17:23:30
 * @LastDescript: 
 */

// 日志文件
const log = require('../logger').logger('paramsMid', 'info');
// 返回值列表
const rcodeMap = require('../maps/rcodeMap');
// 错误代码
const failedRcode = rcodeMap.notParam;


function paramsCheck(ruleParams) {
    // 确定该接口需要检查什么参数
    // 检查数据是否存在
    return function(req, res, next) {
        if (!ruleParams) {
            return next();
        }
        // 查询是否通过检测
        let isPass;
        if (ruleParams.get) {
            isPass = checkUrlParams('get', ruleParams.get, req.query);
        }
        if (ruleParams.post) {
            isPass = checkUrlParams('post', ruleParams.post, req.body);
        }
        if (!isPass.pass) {
            log.warn(isPass.msg);
            res.json({
                rcode: failedRcode,
                msg: isPass.msg
            });
            return;
        }
        next();
    }
}
/**
 * 判断参数为空
 * @param {*} s 要判断的参数
 */
function isEmpty(s) {
    if (s == undefined || s === '') {
        return true
    }
    return false
}

/**
 * 参数检查
 * @param {*} rule 
 * @param {*} params 
 */
function checkUrlParams(type = 'get', rules, params) {
    let paramFields = Object.keys(rules);
    //查看规则
    for (let i = 0; i < paramFields.length; i++) {
        let field = paramFields[i];
        let rule = rules[field];
        // 是否匹配类型
        let isTypeEnum = false;
        // 1. 检查必填参数是否输入
        if (rule.required && isEmpty(params[field])) {
            return { pass: false, msg: `${type} param ${field} required`, matchRule: rule }
        }

        // 2. 查看参数类型是否符合可选类型
        if (rule.types && rule.types.length) {
            // 只需要满足一个
            for (let i = 0; i < rule.types.length; i++) {
                if (typeof params[field] == rule.types[i]) {
                    isTypeEnum = true;
                }
            }
            // 查看该值是否为空
            if (!isTypeEnum) {
                return { pass: false, msg: `${type} param ${field} Type Error need ${rule.types.join('|')} but ${typeof params[field]}`, matchRule: rule }
            }
        }


        // 3. 查看参数是否为空,为空则自动修改为默认值
        if (rule.default && params[field] === undefined) {
            console.log(`设置默认值字段:${field},值${rule.default}`);
            params[field] = rule.default;
        }

    }
    return { pass: true };
}

module.exports = paramsCheck;
