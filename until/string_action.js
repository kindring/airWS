module.exports = function (str1,action,str2){
    str1.__proto__[action]=str2;
    return str1;
}