/**
 * 获取unix时间戳
 * @param [date] 时间对象
 * @returns {number}
 */
function getUnixTimeStamp(date = new Date()){
    return date.getTime() / 1000;
}


module.exports = {
    getUnixTimeStamp
}
