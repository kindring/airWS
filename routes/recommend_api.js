const router = require('express').Router();
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');
const c_recommend = require("../controller/c_recommend");
const field = require('../maps/field');
const code = require('../maps/rcodeMap');
const progress = require('../maps/progress')
router.get('/recommends',async (req,res)=>{
    try{
        let results = await c_recommend.list();
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
router.get('/homer',async (req,res)=>{
    try{
        let results = await c_recommend.homeRecommends();
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


router.post('/recommend/add',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            recommendName:{required:true},
            descript:{required:true},
        }
    }),
    async (req,res)=>{
    try{
        let results = await c_recommend.addRecommend(req.body.recommendName,req.body.descript ,req.body.zIndex,req.body.imgUrl);
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

router.post('/recommend/flights',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            recommendId:{required:true},
            flights:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_recommend.addFlights(req.body.recommendId,req.body.flights);
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
