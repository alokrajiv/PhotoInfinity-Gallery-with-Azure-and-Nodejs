var assert = require('chai').assert;
var request = require("request");
describe('hooks', function() {


    describe('Category Listing - CR', function() {
        it('add to list', function(done) {

            var options = {
                method: 'POST',
                url: 'http://localhost:3001/category/',
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json'
                },
                body: {
                    newCategory: {
                        name: 'catSample'
                    }
                },
                json: true
            };

            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                    
                assert.equal(body.onSave,'success') ;
                done();
            });

        });
        it('read from list', function(done) {
            var options = { method: 'GET',
                url: 'http://localhost:3001/category/'
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
                assert(body.isArray([]));
                done();
            });
        });
    });
});