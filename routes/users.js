const router = require('express').Router();
const userApi = require('./userApi');
/* 登录页面, . */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use('/api',userApi)

module.exports = router;
