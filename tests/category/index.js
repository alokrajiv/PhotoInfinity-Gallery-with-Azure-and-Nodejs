var assert = require('chai').assert;
var request = require("request");
var testHelper = require('../helpers');
describe('Category Endpoint - CR', function() {
    it('create a category ', function(done) {

        var options = {
            method: 'POST',
            url: 'http://localhost:3001/category/',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: {
                newCategory: {
                    name: testHelper.randomstring(6)
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
    it('read categories', function(done) {
        var options = {
            method: 'GET',
            url: 'http://localhost:3001/category/',
            json: true
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            assert.equal(body.onFind, 'success');
            done();
        });
    });
});