var express = require('express');
var router = express.Router();
var db = require('../models/comment');


router.get('/', function (req, res) {
    res.redirect('/static/html/admin/');
});

router.post('/', function (req, res) {
    res.redirect('/static/html/admin/');
});

router.put('/', function (req, res) {
    res.redirect('/static/html/admin/');
});

router.delete('/', function (req, res) {
    res.redirect('/static/html/admin/');
});

module.exports = router;
