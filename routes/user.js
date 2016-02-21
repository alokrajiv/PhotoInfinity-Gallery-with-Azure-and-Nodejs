var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    res.json({userData: 'BLOB'});
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
