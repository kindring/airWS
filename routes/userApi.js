const router = require('express').Router();
const checkParams = require('../middleware/paramsCheck')
const checkLogin = require('../middleware/checkLogin')
const c_user = require("../controller/account");
const code = require("../maps/rcodeMap");
const  fields = require("../maps/field")
const progress = require('../maps/progress')
// 检查账户 是否存在
router.get('/check',
    checkParams({
       get:{
           account:{required:true}
       }
    }),
    async (req,res)=>{
        try{
            let results = await c_user.checkAccount(req.query.account,fields.userType );
            res.json({
                rcode: code.ok,
                data: results
            })
        }catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
})
// 获取用户信息
router.get('/info',checkLogin(fields.userType),async(req,res)=>{
    try{
        let results = await c_user.info(fields.userType,req.session[progress.userSessionField]);
        res.json({
            rcode: code.ok,
            data: results
        })
    }catch (error) {
        if (error.rcode !== code.customError) {
            console.log(error);
        }
        res.json({
            rcode: error.rcode || code.serverError,
            msg: error.msg || error.message
        });
    }
});

module.exports = router;