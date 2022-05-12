const codeMap = require("../maps/rcodeMap");
// 日志
const log = require('../logger').logger('errorHandle', 'info');
function errHandle(apiStr,res,err){
    err.rcode = parseInt(err.rcode)
    if (err.rcode !== codeMap.customError) {
        console.log(err);
        log.error(`api:${apiStr}_Error ${err.message||err.msg}`);
    }
    // 操作超时
    if (err.code === 'ESOCKETTIMEDOUT') {
        err.rcode = codeMap.timeout;
    }
    res.json({
        rcode: err.rcode || codeMap.serverError,
        msg: err.msg || err.message
    });
}
module.exports = errHandle;
