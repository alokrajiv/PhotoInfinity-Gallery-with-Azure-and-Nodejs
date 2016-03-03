var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    var ArtifactModel = require('../../models/artifact.js');
    ArtifactModel.find({},function(err, data){
        res.json(data); 
    });
});


module.exports = router;
