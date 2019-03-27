var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//配置cookie
app.use(cookieParser());
//配置session
app.use(session({
  resave:true,
  saveUninitialized:true,
  //secret加密用得秘钥
  secret:'midu',
  //cookie生命周期(单位：毫秒)
  cookie:{
    maxAge:1000*60*30
  }
}));
//多个页面内共享session
app.use(function(req,res,next){
  //res.locals本地储存信息的对象
  //设置默认信息
  res.locals.user='';
  if(req.session.user){
    res.locals.user=req.session.user;
  }
  next();
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

module.exports = app;
