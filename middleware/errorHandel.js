/*
 * @Description: express的错误处理函数
 * @Autor: kindring
 * @Date: 2021-12-14 11:44:49
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-14 11:48:09
 * @LastDescript: 
 */
function err(err, req, res, next) {
    console.log('----- Error Start ---');
    console.error(err.message)
    console.error(err.stack)
    res.status(500).send('server error');
    console.log('----- Error End ---');
}

module.exports = err;