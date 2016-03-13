var express = require('express');
var router = express.Router();
var UserModel = require('../models/user.js');

router.get('/', function (req, res) {
    UserModel.find({}, function (err, data) {
        res.json(data);
    })
});
router.get('/username/:username', function (req, res) {
    UserModel.findOne({ username: req.params.username }, function (err, user) {
        req.json({data: user});
    });
});

router.get('/id/:id', function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        res.json({data: user});
    })
});

router.post('/', function (req, res) {
    res.redirect('/static/');
});
router.put('/', function (req, res) {
    res.redirect('/static/');
});
router.delete('/', function (req, res) {
    res.redirect('/static/');
});



module.exports = router;
