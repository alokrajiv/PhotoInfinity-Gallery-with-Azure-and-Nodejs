var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var formidable = require('formidable');
var logger = require('../tools/logger.js')
var blobClient = azure.createBlobService("artifactstorage1", "whkQiGJDrzxEfnSJMDp7i5u1CSikwJBl1S0wPc+CT8syIcrXqf8qzXo1koCAYYDYR6OG6iWPTBurflDc1JWhYQ=="),
    containerName = 'taskcontainer';
blobClient.createContainerIfNotExists(containerName, {
    publicAccessLevel: 'blob'
}, function (error, result, response) {
    if (!error) {
        logger.log('info', 'from createContainerIfNotExists', {error: error, result: result});
    }
    else {
        logger.log('error', 'from createContainerIfNotExists', {error: error, result: result});
    }
});
//console.log(blobClient);
function setSAS(containerName, blobName) {
    var sharedAccessPolicy = {
        AccessPolicy: {
            Expiry: azure.date.minutesFromNow(3)
        }
    };

    var blobUrl = blobClient.getBlobUrl(containerName, blobName, sharedAccessPolicy);
    console.log("access the blob at ", blobUrl);
}

/* GET home page. */
router.get('/list', function (req, res) {

    console.log(blobClient);
    blobClient.listBlobsSegmented(containerName, null, function (error, result, response) {
        res.json({
            error: error,
            result: result,
            response: response
        });
    });
});



router.post('/uploadhandler', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var formValid = true;
        console.log(files);
        res.json({ fields: fields, files: files });
        if (fields.itemName === '') {
            formValid = false;
        }

        if (formValid) {
            var extension = files.uploadedFile.name.split('.').pop();
            var newName = fields.itemName + '.' + extension;

            var options = {
                contentType: files.uploadedFile.type,
                metadata: { fileName: newName }
            };

            blobClient.createBlockBlobFromLocalFile(containerName, fields.itemName, files.uploadedFile.path, options, function (error) {
                if (error != null) {
                } else {
                    setSAS(containerName, fields.itemName);
                    res.redirect('/Display');
                }
            });
        } else {
        }
    });
});

module.exports = router;
