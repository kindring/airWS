/*
 * @Description: 解析formdata类型接口
 * @Autor: kindring
 * @Date: 2022-02-10 15:48:37
 * @LastEditors: kindring
 * @LastEditTime: 2022-02-10 15:52:39
 * @LastDescript: 
 */


module.exports = function(req, res, next) {
    req.body = {...req.body, ...req.fields }
    next();
}