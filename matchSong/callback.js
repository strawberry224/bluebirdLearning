'user strict';

const crypto = require('../cryptoData');
const fs = require('fs');
const logger = require('../logger');
const settings = require('../settings');
const request = require('request');

/**
 * 匹配出所有评论数大于预设的歌曲
 * @param  {Int} songId   待查询歌曲ID
 * @return {null}
 */
function matchSong(songId, callback) {
  const url = `${settings.baseUrl}v1/resource/comments/R_SO_4_${songId}/?csrf_token=`;
  const text = JSON.stringify({'username': '', 'password': '', 'rememberLogin': 'true'});
  const form = crypto.getData(text);
  const options = {url: url, headers: settings.headers, form: form};

  request.post(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error);
    }
    callback(null, body);
  });
}

/**
 * 将数据写入文件
 * @param  {String} songId 待写入歌曲ID
 * @return {null}
 */
function write(songId, callback) {
  matchSong(songId, function(error, value) {
    if (error) {
      return callback(error);
    }
    logger.debug(value);
    fs.appendFile('./matchSong/tmp.txt', value, 'utf8', function(error) {
      if(error) {
        return callback(error);
      }
      callback(null, 'FINISH');
    });
  });
}

write(100000, function(error, value) {
  if (error)  {
    return logger.error(error);
  }
  logger.debug(value);
});
