const router = require('express').Router();
const IndexApi = require('./IndexApi');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* 登录页面 */
router.get('/login',(req,res)=>{

})

router.use('/api',IndexApi);

module.exports = router;
