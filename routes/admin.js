const router = require('express').Router();
const api_admin_router = require('./admin_api');
const checkLogin = require('../middleware/checkLogin');
const field = require('../maps/field')
const c_user = require("../controller/account");
const code = require("../maps/rcodeMap");
const progress = require("../maps/progress");
const paramsCheck = require("../middleware/paramsCheck");
// 管理员主页
router.get('/',
    checkLogin(field.adminType,'view'),
    function(req, res, next) {
    res.send('respond with a resource');
});

// 管理员登陆页
router.get('/login',
    function(req, res, next) {
        res.send('respond with a resource');
    });

// 登陆接口
router.post('/login',
    paramsCheck({
        post:{
            account:{required:true},
            passwd:{required:true},
            captcha: { required: true }
        }}),
    async (req,res)=>{
        try{
            console.log('登录')
            // 用户登陆
            let result = {
                rcode: code.customError
            };
            // 提前检查验证码是否正确
            if (req.body.captcha.toLowerCase() != req.session.captcha) return res.json({...result, msg: `验证码错误,captcha error` });
            let results = await c_user.login(field.adminType,req.body.account,req.body.passwd);
            console.log(results);
            req.session[progress.adminSessionField] = results;
            res.json({
                rcode: code.ok,
                data: results
            })
        }catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
                console.log.error(`login error ${error.message||error.msg}`);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
})

// 退出登陆
router.post('/logout',
    async (req,res)=>{
        try{
            req.session[progress.adminSessionField] = null;
            res.json({
                rcode: code.ok,
            })
        }catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
                console.log.error(`logout error ${error.message||error.msg}`);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
    });

// 后台相关接口
router.use('/api',checkLogin(field.adminType),api_admin_router)

module.exports = router;
