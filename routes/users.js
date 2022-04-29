const router = require('express').Router();
const userApi = require('./userApi');
const progress = require("../maps/progress");
const code = require("../maps/rcodeMap");
const paramsCheck = require('../middleware/paramsCheck')
const c_user = require("../controller/account");
const fields = require("../maps/field");
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
router.post('/register',
    paramsCheck({
        post: {
          nickName:{required:true},
          account:{required:true},
          passwd:{required:true},
          captcha:{required:true}
        }
}),
    async(req,res)=>{
      try{
        if (req.body.captcha.toLowerCase() != req.session.captcha) return res.json({rcode: code.customError, msg: `验证码错误,captcha error` });
        let results = await c_user.register(fields.userType,
            req.body.account,req.body.passwd,req.body.nickName);
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


router.post('/login',
    paramsCheck({
      post: {
        account:{required:true},
        passwd:{required:true}
      }
    }),
    async(req,res)=>{
      try{
        if (req.body.captcha.toLowerCase() != req.session.captcha) return res.json({rcode: code.customError, msg: `验证码错误,captcha error` });
        let result = await c_user.login(fields.userType,req.body.account,req.body.passwd);
        req.session[progress.userSessionField] = result.account;
        res.json({
          rcode: code.ok,
          data: result.account
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

router.use('/api',userApi)

module.exports = router;
