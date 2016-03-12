var winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: __dirname + '/../data/logs/main.log'
        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: __dirname + '/../logs/error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: __dirname + '/../logs/info.log',
            level: 'info'
        })
    ]
});
