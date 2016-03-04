var assert = require('chai').assert;
var request = require("request");
function randomstring(L){
    var s= '';
    var randomchar = function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}
describe('hooks', function() {
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
                        name: randomstring(6)
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
        it('read categories', function(done) {
            var options = { 
                method: 'GET',
                url: 'http://localhost:3001/category/',
                json: true
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                assert.equal(body.onFind,'success') ;
                done();
            });
        });
    });
});