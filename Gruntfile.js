module.exports = function (grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-keepalive');
    grunt.loadNpmTasks('grunt-shell-spawn');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: './data/tests/results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
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
        }
    });
    grunt.registerTask('startServer', 'Start a custom web server', function () {
        var server = require('./app.js').listen(3001, function () {
            grunt.log.writeln('Express server listening on port ' + server.address().port);
        });
    });
    grunt.registerTask('testServer', ['env:test', 'shell:mongodb', 'startServer']);
    grunt.registerTask('test', ['testServer', 'mochaTest', 'shell:mongodb:kill']);
    grunt.registerTask('default', 'mochaTest');

};