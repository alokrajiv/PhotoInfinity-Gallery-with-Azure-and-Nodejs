var azure = require('azure-storage');
var blobClient = azure.createBlobService("artifactstorage1", "whkQiGJDrzxEfnSJMDp7i5u1CSikwJBl1S0wPc+CT8syIcrXqf8qzXo1koCAYYDYR6OG6iWPTBurflDc1JWhYQ==");
var mainObj = {
    getToken: function(containerName, blobName) {
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

    },
    getURL: function(containerName, blobName) {
        var SASToken = mainObj.getToken(containerName, blobName);
        var sasURL = blobClient.getUrl(containerName, blobName, SASToken);
        return sasURL;
    }
}

module.exports = mainObj;