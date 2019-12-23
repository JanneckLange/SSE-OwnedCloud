const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const config = require('./config/common');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ debug: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middlewares/middleware').decodeJWT);
app.use(require('./middlewares/middleware').redirectLogin);

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

configureDatabase();

function configureDatabase(){
  mongoose.connect(config.database_docker,
      {
        useNewUrlParser: true,
        useCreateIndex: true
      });
  let db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', function() {
    // connected
    console.log('MongoDB connected..');
  });
}

module.exports = app;
