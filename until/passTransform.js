/*
 * @Description: 字符转换为指定字符
 * @Autor: kindring
 * @Date: 2022-01-17 11:30:36
 * @LastEditors: kindring
 * @LastEditTime: 2022-02-17 15:38:05
 * @LastDescript: 
 */
const crypto = require('crypto');
// let CryptoJS = require("crypto-js")
var MCrypt = require('mcrypt').MCrypt;
let CryptoJS = require('./crypto-js')
    // console.log(CryptoJS);
    /**
     * 字符串计算md5
     * @param {*} str 
     * @returns 
     */
function md5(str) {
    const hash = crypto.createHash('md5');
    // 可任意多次调用update(),效果相当于多个字符串相加
    hash.update(str);
    return hash.digest('hex');
}

/**
 * 数值3des加密
 * @param {string} key
 * @param {string} str 
 */
function des3(key, str) {
    //key不足24位自动以0(最小位数是0)补齐,如果多余24位,则截取前24位,后面多余则舍弃掉
    let base64Key = CryptoJS.enc.Utf8.parse(key);
    //加密使用的是3DES中的ECB,解密对应的使用ECB
    let encrypt = CryptoJS.TripleDES.encrypt(str, base64Key, {
        iv: CryptoJS.enc.Utf8.parse('0123456789'), //iv偏移量
        // mode: CryptoJS.mode.CBC, //CBC模式
        mode: CryptoJS.mode.ECB, //ECB模式
        // padding: CryptoJS.pad.Pkcs7 //padding处理
    });
    // console.log(encrypt);
    console.log(encrypt.toString());
    return encrypt.toString();
}

function pkcs5_pad(text, blocksize) {
    console.log(blocksize);
    let pad = blocksize - (text.length % blocksize);
    return `${text}${str_repeat(pad, pad)}`;
}

function str_pad(str, target, fillStr) {
    while (str.length < target) {
        str += fillStr
    }
    return str;
}

function str_repeat(str, n) {
    return new Array(n).fill(str).join('');
}

module.exports = {
    md5: md5,
    des3: des3
}