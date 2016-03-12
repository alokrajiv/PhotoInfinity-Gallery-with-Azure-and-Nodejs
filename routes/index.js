var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/static/');
});

router.get('/test', function(req, res) {
    var UserModel = require('../models/user.js');
    UserModel.find({}, function(err, data) {
        res.json(data);
    })
});

router.post('/register', function(req, res) {
    var UserModel = require('../models/user.js');
    var newUser = new UserModel({
        username: req.body.newUser.username,
        password: req.body.newUser.password,
        userRole: 'regular'
    });
    newUser.save(function(err) {
        if (err) {
            var retData = { onSave: 'failed' };
            if (process.env.NODE_ENV == 'TEST') {
                retData.error = err
            }
            res.json(retData);
        }
        else {
            res.json({ onSave: 'success' });
        };

    });
});

module.exports = router;
