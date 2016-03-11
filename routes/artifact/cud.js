var express = require('express');
var router = express.Router();
var ArtifactModel = require('../../models/artifact.js');
var azure = require('azure-storage');
var logger = require('../../tools/logger.js');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './data/tempUpld/')
    },
    filename: function(req, file, cb) {
        require("crypto").pseudoRandomBytes(16, function(err, raw) {
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname))
        });
    }
});
//var upload = multer({ storage: storage });
var upload = multer({ storage: multer.memoryStorage() });
var fs = require('fs');


var blobClient = azure.createBlobService("artifactstorage1", "whkQiGJDrzxEfnSJMDp7i5u1CSikwJBl1S0wPc+CT8syIcrXqf8qzXo1koCAYYDYR6OG6iWPTBurflDc1JWhYQ=="),
    containerName = 'taskcontainer';

blobClient.createContainerIfNotExists(containerName, {
    publicAccessLevel: 'blob'
}, function(error, result, response) {
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
router.post('/o', upload.single('logoImageFile'), function(req, res) {
    var newArtifact = new ArtifactModel({
        name: req.body.newArtifact.name,
        ownerId: req.body.newArtifact.ownerId,
        meta: {
            categoryId: req.body.newArtifact.meta.categoryId,
            subCategoryId: req.body.newArtifact.meta.subCategoryId,
            descr: req.body.newArtifact.meta.descr,
            tags: req.body.newArtifact.meta.tags,
        }
    });
    newArtifact.save(function(err) {
        if (err) {
            res.json({ onSave: 'failed', err: err });
        }
        else {
            res.json({ onSave: 'success' });
        };

    });
});

router.post('/', upload.single('logoImageFile'), function(req, res) {
    var files = req.file;
    var extension = files.originalname.split('.').pop();
    var newName = require('node-uuid').v4() + '.' + extension;
    var filePath = __dirname + '../../data/tempUpld/' + newName;
    var Jimp = require("jimp");
    console.log("0reached!!");
    Jimp.read(files.buffer, function(err, image) {
        console.log("1reached!!");
        image.resize(500, 500);
        console.log("2reached!!");
        image
            .write(filePath, function() {
                var options = {
                    contentType: files.mimetype,
                    metadata: { fileName: newName }
                };
                blobClient.createBlockBlobFromLocalFile(containerName, newName, filePath, options, function(error) {
                    console.log("reached!!");
                    if (error != null) {
                        res.json({ error: error });
                    } else {
                        fs.unlinkSync(filePath);
                        var blobName = newName;
                        var SASToken = setSAS(containerName, blobName);
                        var sasURL = blobClient.getUrl(containerName, blobName, SASToken);
                        var newArtifact = new ArtifactModel({
                            name: req.body.newArtifactName,
                            ownerId: req.body.newArtifactOwnerId,
                            meta: {
                                categoryId: req.body.newArtifactMetaCategoryId,
                                subCategoryId: req.body.newArtifactMetaSubCategoryId,
                                descr: req.body.newArtifactMetaDescr,
                                tags: req.body.newArtifactMetaTags.split(','),
                                logo:{
                                    name: req.body.itemName,
                                    blobName: blobName
                                }
                            }
                        });
                        newArtifact.save(function(err) {
                            if (err) {
                                res.json({ onSave: 'failed', err: err, sasURL: sasURL });
                            }
                            else {
                                res.json({ onSave: 'success', sasURL: sasURL });
                            };

                        });
                    }
                });
            });

        /*
        image.getBuffer(Jimp.MIME_JPEG, function(err, imageBuffer) {
            console.log("3reached!!");
            if (err) throw err;
            
            var stream = require('stream');
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuffer);
            console.log("4reached!!");
            
            var lengthStream = require('length-stream');
            var lstream = lengthStream(function(l){
                console.log("Alok");
            }); // create instance, lengthListener will get length 
            bufferStream
                .pipe(process.stdout)
                .pipe(lstream)
                
            streamifier.createReadStream(imageBuffer).pipe(process.stdout);
            
            var options = {
                contentType: files.mimetype,
                metadata: { fileName: newName }
            };
            blobClient.createBlockBlobFromStream(containerName, fields.itemName, bufferStream, options, function(error) {
                console.log("5reached!!");
                if (error != null) {
                    res.json({ error: error });
                } else {
                    //var filePath = files.path;
                    //fs.unlinkSync(filePath);
                    var blobName = fields.itemName;
                    var SASToken = setSAS(containerName, blobName);
                    var sasURL = blobClient.getUrl(containerName, blobName, SASToken);
                    res.json({ sasURL: sasURL })
                    //res.redirect('/upload/list/');
                }
            });
        });
        */
    });
});


router.post('/addData', upload.single('uploadedFile'), function(req, res) {
    var files = req.file,
        fields = req.body;
    var extension = files.originalname.split('.').pop();
    var newName = fields.itemName + '.' + extension;

    var options = {
        contentType: files.mimetype,
        metadata: { fileName: newName }
    };
    console.log(extension);
    require('lwip').open(files.path, function(err, image) {
        // check err...
        // define a batch of manipulations and save to disk as JPEG:
        image.batch()
            .resize(500, 500)
            .writeFile(files.path, function(err) {
                blobClient.createBlockBlobFromLocalFile(containerName, fields.itemName, files.path, options, function(error) {
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


router.put('/', function(req, res) {

});

router.delete('/', function(req, res) {

});
module.exports = router;
