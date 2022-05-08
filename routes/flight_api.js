const router = require('express').Router();
const c_flight = require('../controller/c_flight')
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');
const code = require('../maps/rcodeMap')
const field = require('../maps/field')
const c_area = require("../controller/c_area");
const progress = require('../maps/progress')
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
             req.body.flightState,
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

router.get('/info',
    paramsCheck({
        get:{
            flightId:{required:true}
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.flightInfo(req.query.flightId);
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
            airId:{required:true},
            originalPrice:{required:true},
            currentPrice:{required:true},
            sailingTime:{required:true},
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
                req.body.airId,
                req.body.originalPrice,
                req.body.currentPrice,
                req.body.sailingTime,
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
            let results = await c_flight.updateFlight(req.body.flightId, req.body.newOption);
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

router.get('/news',async (req,res)=>{
    try{
        let num = 5;
        if(req.query.all === 'true'){
            num = 99999;
        }
        let results = await c_flight.news(num);
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


router.post('/sells',
    paramsCheck({
        post:{
            departureCity:{required:true},
            targetCity:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.searchFlights(field.flightState_sail,req.body);
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

router.get('/sellist',
    async (req,res)=>{
        try{
            let results = await c_flight.searchFlights(field.flightState_sail, {});
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
router.post('/state',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            flightId:{required:true},
            nextState:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.updateFlight(req.body.flightId, {
                flightState:req.body.nextState
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
})

router.get('/airs',
    async (req,res)=>{
        try{
            let results = await c_flight.airs(req.query.state);
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

router.get('/seat',
    paramsCheck({
        get:{
            flightId:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.seatInfo(req.query.flightId);
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


router.post('/air/add',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            airCode:{required:true},
            col:{required:true},
            row:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.addAir(req.body.airCode,
                req.body.row,req.body.col);
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

router.post('/air/change',
    checkLogin(field.adminType),
    paramsCheck({
        post:{
            airId:{required:true},
            params:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_flight.updateAir(req.body.airId,
                req.body.params);
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
