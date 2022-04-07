const router = require('express').Router();
const field = require('../maps/field')
// const c_user = require("../controller/account");
const code = require("../maps/rcodeMap");
const progress = require("../maps/progress");
const c_user = require("../controller/account");
const c_flight = require("../controller/flight");
const paramsCheck = require("../middleware/paramsCheck");
// 获取航班列表数据
router.get('/flights',
    paramsCheck({
        get:{
            departure:{required:true},
            target:{required:true}
        }}),
    async (req,res)=>{
    try{
        let results = await c_flight.searchFlight(field.adminType,req.body.account,req.body.passwd);
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

module.exports = router;
