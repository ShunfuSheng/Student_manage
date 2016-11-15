var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');

var app = express();

//使用art-template模板
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//加载一些中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//引入子模板
// 系统自带子模块
app.use('/users', users);
// 旧版的学生信息管理模块，包括增删查改功能
app.use('/admin/manage', require('./routes/admin/manage'));
// 写死的管理员模块
app.use('/admin/admin_user', require('./routes/admin/admin_user'));
// 学生个人管理模块，包括注册、登录、个人页面展示
app.use('/users/manage', require('./routes/users/manage'));
//书籍管理模块，包括书籍列表展示、个人借阅处理
app.use('/users/book', require('./routes/users/book'));


//网站根路径的重定向
app.get('/', function (req, res) {
  res.redirect('/users/book/list');
})





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
