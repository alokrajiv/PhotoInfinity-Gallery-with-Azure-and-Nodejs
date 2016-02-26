var winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: 'data/logs/main.log'
        }),
        new (winston.transports.File)({
            name: 'error-log',
            filename: 'data/logs/error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'data/logs/info.log',
            level: 'info'
        })
    ]
});
