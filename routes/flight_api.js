const router = require('express').Router();
const c_flight = require('../controller/c_flight')
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');
const code = require('../maps/rcodeMap')
const field = require('../maps/field')
const c_area = require("../controller/c_area");

router.get('/list',async (req,res)=>{
    try{
        let results = await c_flight.flightList();
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

router.post('/search',
    paramsCheck({
        post:{
            departure:{required:true},
            target:{required:true},
        }
    }),
    async (req,res)=>{
    try{
        let params = [
             req.body.departure,
             req.body.target,
             req.body.routeType,
             req.body.startTime,
             req.body.endTime,
        ]
        let results = await c_flight.searchFlight(...params);
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

router.get('/detail',
    paramsCheck({
        get:{
            flight:{required:true}
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.flightInfo(req.query.flight);
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
    }
)

// 新增航班
router.post('/add',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            flightName:{required:true},
            airCode:{required:true},
            originalPrice:{required:true},
            currentPrice:{required:true},
            seilingTime:{required:true},
            langdinTime:{required:true},
            totalVotes:{required:true},
            departureCity:{required:true},
            targetCity:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.addFlight(
                req.body.flightName,
                req.body.airCode,
                req.body.originalPrice,
                req.body.currentPrice,
                req.body.seilingTime,
                req.body.langdinTime,
                req.body.totalVotes,
                req.body.departureCity,
                req.body.targetCity,
            );
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
    }
)

// 更新指定航班
router.post('/update',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            flightId:{required:true},
            newOption:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.updateFlight({
                flightName:req.body.flightName,
                airCode:req.body.airCode,
                originalPrice:req.body.originalPrice,
                currentPrice:req.body.currentPrice,
                seilingTime:req.body.seilingTime,
                langdinTime:req.body.langdinTime,
                totalVotes:req.body.totalVotes,
                departureCity:req.body.departureCity,
                targetCity:req.body.targetCity
            });
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
    }
)
module.exports = router;
