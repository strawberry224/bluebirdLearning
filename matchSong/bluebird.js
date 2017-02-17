'user strict';

const Promise = require('bluebird');
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
function write(value, callback) {
  logger.debug(value);
  fs.appendFile('./matchSong/tmp.txt', value, 'utf8', function(error) {
    if(error) {
      return callback(error);
    }
    callback(null, 'FINISH');
  });
}

// const msPromise = Promise.promisify(matchSong);
// const wPromise = Promise.promisify(write);
//
// msPromise(100000).then(wPromise);

// 将matchSong和write都转化成Promise风格的
// 转化之后每个函数后面都会带上Async
const promise = Promise.promisifyAll({matchSong, write});
promise.matchSongAsync(100000).then(promise.writeAsync);
