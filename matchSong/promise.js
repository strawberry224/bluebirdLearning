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

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }
      resolve(body);
    });
  });
}

/**
 * 将数据写入文件
 * @param  {String} songId 待写入歌曲ID
 * @return {null}
 */
function write(value) {
  // logger.debug(value);
  return new Promise(function(resolve, reject) {
    fs.appendFile('./matchSong/tmp.txt', value, 'utf8', function(error) {
      if(error) {
        reject(error);
      } else {
        resolve(JSON.parse(value).total);
      }
    });
  });
}

// matchSong(100000).then(function(value) {
//   write(value).then(function(finish) {
//     logger.debug(finish);
//   }).catch(function(error) { // write error
//     logger.error(error);
//   });
// }).catch(function(error) { // matchSong error
//   logger.error(error);
// });

matchSong(100000).then(write);

function matchSongPromise(songId) {
  return matchSong(songId).then(write);
}
exports.matchSongPromise = matchSongPromise;
