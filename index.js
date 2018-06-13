var ShortUniqueId = require('short-unique-id');
var uid = new ShortUniqueId();

var async = require('async');
var winston = require('winston');
winston.add(require('winston-graylog2'), {
    name: 'Graylog',
    level: 'debug',
    silent: false,
    handleExceptions: false,
    prelog: function(msg) {
        return msg.trim();
    },
    graylog: {
        servers: [{host: '127.0.0.1', port: 8514}],
        hostname: 'myServer',
        facility: 'Test logger / Node.JS Test Script',
        bufferSize: 1400
    },
    staticMeta: {env: 'staging'}
});

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'warn-file',
            filename: 'filelog-warn.log',
            level: 'warn'
        }),
        new (winston.transports.File)({
            name: 'debug-file',
            filename: 'filelog-debug.log',
            level: 'debug'
        })
    ]
});

var i = 0;
var stack = [];
while(i < 100) {
    stack.push(function(callback) {
        setTimeout(function() {
            callback(null, 'log - ' + uid.randomUUID(6));
        }, 500);
    });
    i++;
}
async.parallel(stack, function(err, results) {
    results.forEach(result => {
        logger.log('info', result, new Date());
        logger.log('warn', result, new Date());
        logger.log('debug', result, new Date());
        logger.log('error', result, new Date());
        winston.log('info', result, new Date());
        winston.log('warn', result, new Date());
        winston.log('debug', result, new Date());
        winston.log('error', result, new Date());
    });
});
