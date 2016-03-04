var assert = require('chai').assert;
var request = require("request");

describe('Artifact Endpoint - CR', function() {
    it('create an artifact ', function(done) {

        var options = {
            method: 'POST',
            url: 'http://localhost:3001/artifact/cud/',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: {
                newArtifact: {
                    name: 'test artifact 1',
                    ownerId: '56d8108222eeab990c278a74',
                    meta: {
                        categoryId: '56d8108c22eeab990c278a75',
                        subCategoryId: '56d8113d7a9215c80cb51a3d',
                        descr: 'Random Desription String',
                        tags: ['dragon', 'testtag']
                    }
                }
            },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            assert.equal(body.onSave, 'success');
            done();
        });

    });
    it('read artifacts', function(done) {
        var options = {
            method: 'GET',
            url: 'http://localhost:3001/artifact/',
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            assert.equal(body.onFind, 'success');
            done();
        });
    });
});