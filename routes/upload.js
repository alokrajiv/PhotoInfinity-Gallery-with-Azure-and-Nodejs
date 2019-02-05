var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var logger = require('../tools/logger.js');
var multer = require('multer');
var path = require('path');
//var upload = multer({ dest: './data/tempUpld/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/tempUpld/')
    },
    filename: function (req, file, cb) {
        require("crypto").pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname))
        });
    }
});
var upload = multer({ storage: storage });
var fs = require('fs');


var blobClient = azure.createBlobService("artifactstorage1", "---------------"),
    containerName = 'taskcontainer';

blobClient.createContainerIfNotExists(containerName, {
    publicAccessLevel: 'blob'
}, function (error, result, response) {
    if (!error) {
        logger.log('info', 'from createContainerIfNotExists', { error: error, result: result });
    }
    else {
        logger.log('error', 'from createContainerIfNotExists', { error: error, result: result });
    }
});
function setSAS(containerName, blobName) {
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        },
    };
    var SASToken = blobClient.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
    return SASToken;
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

router.post('/testUpload', upload.single('uploadedFile'), function (req, res) {
    var files = req.file,
        fields = req.body;
    var extension = files.originalname.split('.').pop();
    var newName = fields.itemName + '.' + extension;

    var options = {
        contentType: files.mimetype,
        metadata: { fileName: newName }
    };
    console.log(extension);
    require('lwip').open(files.path, function (err, image) {
        // check err...
        // define a batch of manipulations and save to disk as JPEG:
        image.batch()
            .resize(500, 500)
            .writeFile(files.path, function (err) {
                blobClient.createBlockBlobFromLocalFile(containerName, fields.itemName, files.path, options, function (error) {
                    console.log("reached!!");
                    if (error != null) {
                        res.json({ error: error });
                    } else {
                        var filePath = files.path;
                        fs.unlinkSync(filePath);
                        var blobName = fields.itemName;
                        var SASToken = setSAS(containerName, blobName);
                        var sasURL = blobClient.getUrl(containerName, blobName, SASToken);
                        res.json({ sasURL: sasURL })
                        //res.redirect('/upload/list/');
                    }
                });
            });
    });
})

module.exports = router;
