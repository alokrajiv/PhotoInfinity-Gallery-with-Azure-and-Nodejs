var express = require('express');
var router = express.Router();
var azureHelper = require('../../tools/azureHelper.js');
var async = require('async');
router.get('/', function(req, res) {
    var ArtifactModel = require('../../models/artifact.js');
    ArtifactModel.find({}, function(err, data) {
        if (err) {
            res.json({ onFind: 'failed', err: err });
        }
        else {
            async.map(data, function(artifact, callback) {
                artifact = artifact.toObject();
                artifact.meta.logo.url = azureHelper.getURL('taskcontainer', artifact.meta.logo.blobName);
                callback(null, artifact);
                console.log(artifact.meta);
            }, function(err, artifacts) {
                // if any of the file processing produced an error, err would equal that error
                if (err) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A file failed to process');
                } else {
                    console.log('All files have been processed successfully');

                    res.json({ onFind: 'success', data: artifacts });
                }
            });
        };
    });
});


module.exports = router;
