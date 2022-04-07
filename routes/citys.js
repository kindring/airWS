const router = require('express').Router();
const c_area = require('../controller/c_area')
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');
const code = require('../maps/rcodeMap')
const field = require('../maps/field')

router.get('/list',async (req,res)=>{
    try{
        let results = await c_area.searchCity(req.query.cityType);
        res.json({
            rcode: code.ok,
            data: results
        })
    }catch (error) {
        if (error.rcode !== code.customError) {
            console.log(error);
            console.log.error(`get area map error ${error.message||error.msg}`);
        }
        res.json({
            rcode: error.rcode || code.serverError,
            msg: error.msg || error.message
        });
    }
})

// 新增地区
router.post('/add',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            cityType:{required:true},
            cityName:{required:true}
        }
    }),
    async (req,res)=>{
    try{
        let results = await c_area.addCity(req.body.cityType,req.body.cityName);
        res.json({
            rcode: code.ok,
            data: results
        })
    }catch (error) {
        if (error.rcode !== code.customError) {
            console.log(error);
            console.log.error(`get area map error ${error.message||error.msg}`);
        }
        res.json({
            rcode: error.rcode || code.serverError,
            msg: error.msg || error.message
        });
    }
})

// 修改地区
router.post('/change',
    checkLogin(field.adminType),
    paramsCheck({
        body:{
            cityType:{required:true},
            cityName:{required:true}
        }}),async (req,res)=>{
        try{
            let results = await c_area.addCity(req.body.cityType,req.body.cityName);
            res.json({
                rcode: code.ok,
                data: results
            })
        }catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
                console.log.error(`get area map error ${error.message||error.msg}`);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
    })

module.exports = router;