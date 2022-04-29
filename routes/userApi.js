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
router.post('/changePhone',
    checkLogin(fields.userType),
    checkParams(
    {
        post:{
            phone:{required:true},
            passwd:{required:true}
        }
    }),async(req,res)=>{
    try{
        let results = await c_user.changePhone(fields.userType,req.session[progress.userSessionField],req.body.passwd,req.body.phone);
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
router.get('/cars',checkLogin(fields.userType),async(req,res)=>{
    try{
        let results = await c_user.cars(req.session[progress.userSessionField]);
        res.json({
            rcode: code.ok,
            data: results,
            total: results.length
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

router.post('/car/add',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                flightId:{required:true}
            }
        }),
    async(req,res)=>{
        try{
            let results = await c_user.addCar(req.body.flightId,req.session[progress.userSessionField]);
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.post('/car/remove',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                carId:{required:true}
            }
        }),
   async(req,res)=>{
        try{
            let results = await c_user.removeCar(req.body.carId);
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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


router.post('/travel/remove',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                travelId:{required:true}
            }
        }),
    async(req,res)=>{
        try{
            let results = await c_user.removeTravel(req.body.travelId);
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.post('/travel/add',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                name:{required:true},
                card:{required:true},
                phone:{required:true},
            }
        }),
    async(req,res)=>{
        try{
            let results = await c_user.addTravel(
                req.body.name,
                req.body.card,
                req.body.phone,
                req.session[progress.userSessionField]);
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.post('/travel/change',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                travelId:{required:true},
                params:{required:true},
            }
        }),
    async(req,res)=>{
        try{
            let results = await c_user.updateTravel(
                req.session[progress.userSessionField],
                req.body.travelId,
                req.body.params,
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.post('/travel/info',
    checkLogin(fields.userType),
    checkParams(
        {
            post:{
                travelId:{required:true},
                passwd:{required:true},
            }
        }),
    async(req,res)=>{
        try{
            let results = await c_user.travelInfo(
                req.session[progress.userSessionField],
                req.body.passwd,
                req.body.travelId,
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.get('/travels',
    checkLogin(fields.userType),
    async(req,res)=>{
        try{
            let results = await c_user.travels(
                req.session[progress.userSessionField],
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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


router.post(
    '/order/add',
    checkLogin(fields.userType),
    checkParams({
            post:{
                flightId:{required:true},
                travelIds:{required:true},
            }
        }),
    async (req,res)=>{
        try{
            let results = await c_user.addOrder(
                req.session[progress.userSessionField],
                req.body.flightId,
                req.body.travelIds,
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.post(
    '/order/pay',
    checkLogin(fields.userType),
    checkParams({
        post:{
            orderId:{required:true},
            passwd:{required:true},
        }
    }),
    async (req,res)=>{
        try{
            let results = await c_user.payOrder(
                req.session[progress.userSessionField],
                req.body.passwd,
                req.body.orderId,
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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

router.get(
    '/orders',
    checkLogin(fields.userType),
    async (req,res)=>{
        try{
            let results = await c_user.orders(
                req.session[progress.userSessionField],
                req.query.type,
            );
            res.json({
                rcode: code.ok,
                data: results,
                total: results.length
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
