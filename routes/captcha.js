/*
 * @Description: 验证码相关函数
 * @Autor: kindring
 * @Date: 2022-01-17 17:52:23
 * @LastEditors: kindring
 * @LastEditTime: 2022-01-26 17:36:02
 * @LastDescript: 
 */
const router = require('express').Router();
const svgCaptcha = require('svg-captcha');
const progress = require("../maps/progress");
// 获取新的验证码.图片,忽略大小写
router.get('/', async(req, res) => {
    let captcha = svgCaptcha.create({
        noise: 7, //生成干扰线的条数 默认值为1
        size: 4, // 验证码长度
        ignoreChars: '0oi', // 验证码字符中排除 0oi
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        // background: '#cc9966', // 验证码图片背景颜色
    });
    req.session[progress.captchaSessionField] = captcha.text.toLowerCase();
    console.log(req.session[progress.captchaSessionField]);
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router;
