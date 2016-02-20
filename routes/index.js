var express = require('express');
var router = express.Router();
var db = require('../models/index');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('/static/');
});

router.get('/admin', function (req, res) {
    res.redirect('/static/');
});


module.exports = router;
