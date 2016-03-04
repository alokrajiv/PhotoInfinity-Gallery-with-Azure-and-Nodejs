var assert = require('chai').assert;
var request = require("request");

describe('User Endpoint - C', function() {
    it('register new user ', function(done) {

        var options = {
            method: 'POST',
            url: 'http://localhost:3001/register/',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: { 
                newUser: 
                { 
                    username: 'testuser', 
                    password: 'password' 
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
});