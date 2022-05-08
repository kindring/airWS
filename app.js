const express = require('express');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const citysRouter = require('./routes/citys');
const adminRouter = require('./routes/admin');
const captcha = require('./routes/captcha');
const flight = require('./routes/flight_api');
const recommend = require('./routes/recommend_api');

const app = express();

const serverConfig = require('./configs/server.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/js', express.static(path.join(__dirname, './public/js')));
app.use('/img', express.static(path.join(__dirname, './public/img')));
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/public', express.static(path.join(__dirname, './public')));
// 配置session
app.use(
    session({
      secret: 'air',
      name: 'session', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
      cookie: { maxAge: 1800000 }, //过期时间半小时
      keys: ['owner','admin', 'captcha'], // 用户登陆信息,验证码字段
      resave: true,
      saveUninitialized: true,
    })
);

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/api/city/',citysRouter);
app.use('/api/captcha', captcha);
app.use('/api/flight', flight);
app.use('/api/recommend', recommend);



app.listen(serverConfig.port, serverConfig.host, ()=>{
  console.warn(`服务启动 server is running to @http://${serverConfig.host}:${serverConfig.port}`);
})

module.exports = app;
