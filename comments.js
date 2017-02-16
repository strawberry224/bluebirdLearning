'user strict';

const async = require('async');
const crypto = require('./cryptoData');
const fs = require('fs');
const logger = require('./logger');
const settings = require('./settings');
const request = require('request');

/**
 * 匹配出所有评论数大于预设的歌曲
 * @param  {Int} songId   待查询歌曲ID
 * @return {null}
 */
function matchSong(songId) {
  const url = `${settings.baseUrl}v1/resource/comments/R_SO_4_${songId}/?csrf_token=`;
  const text = JSON.stringify({'username': '', 'password': '', 'rememberLogin': 'true'});
  const form = crypto.getData(text);
  const options = {url: url, headers: settings.headers, form: form};

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }
      try {
        if (JSON.parse(body).total >= settings.count) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * 将数据写入文件
 * @param  {String} songId 待写入歌曲ID
 * @return {null}
 */
function write(songId) {
  return new Promise(function(resolve, reject) {
    fs.appendFile('./songId.txt', songId + '\n', 'utf8', function(error) {
      if(error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

var queue = async.queue(function(songId, callback) {
  logger.trace(songId);
  matchSong(songId).then(function(value) {
    if (value) {
      write(songId).catch(function(error) {
        callback(error);
      });
    } else {
      callback();
    }
  }).catch(function(error) {
    callback();
  });
}, 50);

// 460039019
for (var i = 300001; i <= 500000; ++ i) {
  queue.push(i);
}
