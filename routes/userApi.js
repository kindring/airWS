const router = require('express').Router();
const checkParams = require('../middleware/paramsCheck')
const c_user = require("../controller/account");
const code = require("../maps/rcodeMap");
const  fields = require("../maps/field")
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
module.exports = router;