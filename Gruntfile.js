module.exports = function (grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-clean');
    
    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: './data/logs/tests/results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    slow: 1 //time threshold in ms after which test execution time is mentioned in the console
                },
                src: ['tests/**/*.js']
            }
        },
        shell: {
            mongodb: {
                command: 'mongod --dbpath ./data/testDB/db',
                options: {
                    async: true,
                    stdout: false,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        cwd: '.'
                    }
                }
            }
        },
        env: {
            test: {
                NODE_ENV: 'TEST',
                TEST_DB_URI: 'mongodb://localhost/artifacts-test-db'
            }
        },
        clean:{
            localTestDB:['./data/testDB/db/*', '!./data/testDB/db/.gitignore']
        }
    });
    grunt.registerTask('startServer', 'Start a custom web server', function () {
        var server = require('./app.js').listen(3001, function () {
            grunt.log.writeln('Express server listening on port ' + server.address().port);
        });
    });
    grunt.registerTask('testServer', ['env:test','clean:localTestDB', 'shell:mongodb', 'startServer']);
    grunt.registerTask('test', ['testServer', 'mochaTest', 'shell:mongodb:kill']);
    grunt.registerTask('default', 'mochaTest');

};