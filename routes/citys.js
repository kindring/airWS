const router = require('express').Router();
const c_area = require('../controller/c_area')
const code = require('../maps/rcodeMap')
router.get('/api/citys',async (req,res)=>{
    try{
        let results = await c_area.searchCity(req.query.cityType);
        // console.log(province);
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
