const router = require('express').Router();
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');
const apiErrHandle = require('../until/apiErrHandle');
const c_recommend = require("../controller/c_recommend");
const field = require('../maps/field');
const code = require('../maps/rcodeMap');
const progress = require('../maps/progress')
router.get('/recommends', async (req, res) => {
    try {
        let results = await c_recommend.list();
        res.json({
            rcode: code.ok,
            data: results
        })
    } catch (error) {
        if (error.rcode !== code.customError) {
            console.log(error);
        }
        res.json({
            rcode: error.rcode || code.serverError,
            msg: error.msg || error.message
        });
    }
});

router.get('/info',
    paramsCheck({
    get: {
        id: {required: true},
    }
}),
    async (req, res) => {
    try {
        let results = await c_recommend.recommendInfo(req.query.id);
        res.json({
            rcode: code.ok,
            data: results
        })
    } catch (error) {
        apiErrHandle('推荐信息', res, error);
    }
});

router.get('/nof',
    paramsCheck({
        get: {
            id: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.recommendNot(req.query.id);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            apiErrHandle('推荐信息', res, error);
        }
    });
router.get('/homer', async (req, res) => {
    try {
        let results = await c_recommend.homeRecommends();
        res.json({
            rcode: code.ok,
            data: results
        })
    } catch (error) {
        if (error.rcode !== code.customError) {
            console.log(error);
        }
        res.json({
            rcode: error.rcode || code.serverError,
            msg: error.msg || error.message
        });
    }
});

router.post('/flight/change',
    paramsCheck({
        post: {
            recommendId: {required: true},
            flightId: {required: true},
            params: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.changeRecommendItem(req.body.recommendId, req.body.flightId, req.body.params);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            apiErrHandle('修改航班项目', res, error);
        }
    });
router.post('/flight/add',
    checkLogin(field.adminType),
    paramsCheck({
        post: {
            recommendId: {required: true},
            flightId: {required: true},
            img: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.addFlight(req.body.recommendId, req.body.flightId, req.body.img,req.body.zIndex);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            apiErrHandle('修改航班项目', res, error);
        }
    });
router.post('/flight/delete',
    checkLogin(field.adminType),
    paramsCheck({
        post: {
            recommendId: {required: true},
            flightId: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.deleteItem(req.body.recommendId, req.body.flightId);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            apiErrHandle('修改航班项目', res, error);
        }
    });

router.post('/add',
    checkLogin(field.adminType),
    paramsCheck({
        post: {
            recommendName: {required: true},
            descript: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.addRecommend(req.body.recommendName, req.body.descript, req.body.zIndex, req.body.imgUrl);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
    });

router.post('/flights',
    checkLogin(field.adminType),
    paramsCheck({
        post: {
            recommendId: {required: true},
            flights: {required: true},
        }
    }),
    async (req, res) => {
        try {
            let results = await c_recommend.addFlights(req.body.recommendId, req.body.flights);
            res.json({
                rcode: code.ok,
                data: results
            })
        } catch (error) {
            if (error.rcode !== code.customError) {
                console.log(error);
            }
            res.json({
                rcode: error.rcode || code.serverError,
                msg: error.msg || error.message
            });
        }
    });

// changeRecommend

router.post('/change',
    paramsCheck({
        post:{
            id: {required:true},
            params: {required:true},
        }
    }),
    async (req, res) => {
    try {
        let results = await c_recommend.changeRecommend(req.body.id,req.body.params);
        res.json({
            rcode: code.ok,
            data: results
        })
    } catch (error) {
        apiErrHandle('修改推荐', res, error);
    }
});
router.post('/search', async (req, res) => {
    try {
        let results = await c_recommend.list();
        res.json({
            rcode: code.ok,
            data: results
        })
    } catch (error) {
        apiErrHandle('搜索推荐', res, error);
    }
});

module.exports = router;
