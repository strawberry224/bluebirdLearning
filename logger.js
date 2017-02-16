var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/lidi.log'), 'lidi');
var logger = log4js.getLogger('lidi');
logger.setLevel('ALL');
module.exports = logger;
