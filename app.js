const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const filelist = require('./fileList')
const cors = require('cors')
// const multer = require('multer')
// const indexJs = require('./indexJs')

const app = express();
const router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const indexList = router.get('/', function (req, res) {
  app.use(express.static(`${__dirname}/public`, { index: 'index.html' }));
  // res.render('index', { title: 'Express' });
})

app.use('/', indexList)
app.use('/file', filelist);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

module.exports = app;
