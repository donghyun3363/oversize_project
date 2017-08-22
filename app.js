var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport')
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var flash = require('connect-flash')

var routes = require('./routes/index');
var users = require('./routes/users');
var main = require('./routes/mainweb');

var app = express();

var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  database: 'webshopping',
  password: '1234'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //Query database or cache here!
  pool.getConnection(function(err, connection){
    connection.query("SELECT * FROM user WHERE id = '"+id+"'", function(err,rows){
      done(null, rows[0]);
      connection.release();
    });
  });
  // done(null, {id: id, name: id}
});


app.use(flash());
passport.use(new passportLocal.Strategy({passReqToCallback : true},function(req,username,password,  done) {
  //pretend this is using a real database!
  pool.getConnection(function (err, connection) {

    connection.query("SELECT * FROM user WHERE id = '"+username+"'", function(err,rows){
      if(err) {return done(err);}
      if(!rows.length) { return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      if(rows[0].passwd == password) {
          done(null, {id: username, name: username});
      }else {
        done(null, null);
      }
      connection.release();
    });
  });
}));

passport.use(new passportHttp.BasicStrategy(verifyCredentials));

function verifyCredentials(username, password, done) {
  if(username ===password) {
    done(null, {id: username, name: username});
  } else {
    done(null, null);
  }
}

app.use('/api', passport.authenticate('basic', {session: false}));

app.use('/', routes);
app.use('/users', users);
app.use('/mainweb',main);


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