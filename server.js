/* global BasicStrategy */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var app = express();
var path = require('path');
var server = require('http').Server(app);
require('./routes/socket.js')(server);


//app.set('port', port); //commented during socket.io implementation.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/static/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new BasicStrategy(
    function(username, password, done) {
        var UserModel = require('./models/user.js');
        UserModel.findOne({ username: username }, function(err, user) {
            if (err) {
                done(null, false);
            }
            else if (!user) {
                done(null, false);
            }
            else {
                user.comparePassword(password, done);
            }
        });
    }
));

app.use('/', require('./routes/index'));
app.use('/upload', require('./routes/upload'));
app.use('/artifact/search', require('./routes/artifact/search'));
app.use('/artifact/cud', require('./routes/artifact/cud'));
app.use('/category', require('./routes/category'));
app.use('/user', require('./routes/user'));
//app.use('/user', passport.authenticate('basic', { session: false }), require('./routes/user'));





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = server;