/**
 * 随机字符串
 * @param length
 * @returns {string}
 */
function randomStr(length) {
    let str = Math.random().toString(36).substr(2);
    if (str.length>=length) {
        return str.substr(0, length);
    }
    str += randomStr(length-str.length);
    return str;
}

module.exports = {
    randomStr
}
