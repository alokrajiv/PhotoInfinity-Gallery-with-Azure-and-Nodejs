var express = require('express');
var router = express.Router();
var azureHelper = require('../../tools/azureHelper.js');
var async = require('async');
router.get('/', function(req, res) {
    var ArtifactModel = require('../../models/artifact.js');
    var page = req.query.page || 1,
        limit = req.query.limit || 11;
    ArtifactModel.paginate({}, { page: page, limit: limit }, function(err, data) {
        data = data.docs;
        if (err) {
            res.json({ onFind: 'failed', err: err });
        }
        else {
            async.map(data, function(artifact, callback) {
                artifact = artifact.toObject();
                artifact.meta.logo.url = azureHelper.getURL('taskcontainer', artifact.meta.logo.blobName);
                callback(null, artifact);
            }, function(err, artifacts) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                    console.log('A url failed to process');
                } else {
                    res.json({ onFind: 'success', data: artifacts });
                }
            });
        };
    });
});


module.exports = router;
