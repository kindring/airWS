const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ejs = require('ejs');
const bodyParser = require('body-parser');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const serverConfig = require('./configs/server.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/js', express.static(path.join(__dirname, './public/js')));
app.use('/js', express.static(path.join(__dirname, './public/img')));
app.use('/', express.static(path.join(__dirname, './public')));

// 配置session
app.use(
    session({
      secret: 'air',
      name: 'session', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
      cookie: { maxAge: 1800000 }, //过期时间半小时
      keys: ['owner', 'captcha'], // 用户登陆信息,验证码字段
      resave: true,
      saveUninitialized: true,
    })
);

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(serverConfig.port, serverConfig.host, ()=>{
  log.warn(`服务启动 server is running to @http://${serverConfig.host}:${serverConfig.port}`);
})
module.exports = app;
