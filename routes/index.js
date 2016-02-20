var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('/static/');
});

router.get('/test', function (req, res) {
    var UserModel = require('../models/user.js');
    UserModel.find({},function(err, data){
        res.json(data); 
    })
});


module.exports = router;
