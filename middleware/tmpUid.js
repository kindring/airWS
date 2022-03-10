/*
 * @Description: 临时id生成.
 * @Autor: kindring
 * @Date: 2022-01-17 16:49:32
 * @LastEditors: kindring
 * @LastEditTime: 2022-01-17 16:58:03
 * @LastDescript: 
 */
// 1. 用户浏览器请求验证码
// 2. 服务器生成临时标识,顺便生成验证码图片,存储redis
// 3. 用户输入验证码发送到后端


/**
 * 生成是否登录中间件
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkTmpUid(req, res, next) {
    // 只在未登陆时创建临时uid
    if (!req.session.owner) {
        // 如果有临时凭证则自动生成,没有则跳过
        if (req.session.tmpUid) {
            // 延长过期时间
        } else {
            // 生成临时id
        }
    }
    next();
}