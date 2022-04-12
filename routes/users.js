const router = require('express').Router();
const userApi = require('./userApi');
const progress = require("../maps/progress");
const code = require("../maps/rcodeMap");
/* 登录页面, . */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout',(req,res)=>{
  try{
    console.log('退出登陆')
    req.session[progress.userSessionField] = null;
    res.redirect(302,progress.userLoginUrl)
  }catch (error) {
    if (error.rcode !== code.customError) {
      console.log(error);
      console.log.error(`logout error ${error.message||error.msg}`);
    }
    res.json({
      rcode: error.rcode || code.serverError,
      msg: error.msg || error.message
    });
  }
});
router.use('/api',userApi)

module.exports = router;
