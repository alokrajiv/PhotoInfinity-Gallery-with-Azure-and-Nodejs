/* global BasicStrategy */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var app = express();

var path = require('path');
var log = require('./logger.js')(module);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new BasicStrategy(
    function (username, password, done) {
        var UserModel = require('./models/user.js');
        UserModel.findOne({username: username}, function(err, user){
            if(err){
                done(null, false);
            }
            else if(!user){
                done(null, false);
            }
            else{
                user.comparePassword(password, done);
            }
        });
    }
    ));

app.use('/', require('./routes/index'));
app.use('/user',passport.authenticate('basic', { session: false }), require('./routes/user'));



/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
