var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/music.log'), 'music');
var logger = log4js.getLogger('music');
logger.setLevel('ALL');
module.exports = logger;
