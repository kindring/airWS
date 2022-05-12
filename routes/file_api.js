const router = require('express').Router();
const paramsCheck = require('../middleware/paramsCheck');
const checkLogin = require('../middleware/checkLogin');

const code = require('../maps/rcodeMap')
const field = require('../maps/field')
const progress = require('../maps/progress')

const apiErrHandle = require('../until/apiErrHandle')
const c_file = require("../controller/c_file");
const {adminType} = require("../maps/field");
const fileUpload = require('../middleware/fileUpload')
/**
 * 获取文件
 */
router.get('/list',async(req,res)=>{
    try{
        let results = await c_file.loadImgs();
        res.json({
            rcode: code.ok,
            data: results
        })
    }catch (e) {
        apiErrHandle('fileLoad',res,e);
    }
});

/**
 * 上传文件
 */
router.post('/up',
    fileUpload,
    async (req,res)=>{
        try{
            console.log('接收到文件上传');
            let results = await c_file.toUpload(req.files);
            res.json({
                rcode: code.ok,
            })
        }catch (e) {
            res.status(500)
            apiErrHandle('fileLoad',res,e);
        }
    }
)

module.exports = router;

