var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    var ArtifactModel = require('../../models/artifact.js');
    ArtifactModel.find({},function(err, data){
        if (err) {
            res.json({ onFind: 'failed', err: err });
        }
        else {
            res.json({ onFind: 'success', data: data });
        };
    });
});


module.exports = router;
