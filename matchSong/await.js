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
  return new Promise(function(resolve, reject) {
    fs.appendFile('./matchSong/tmp.txt', value, 'utf8', function(error) {
      if(error) {
        reject(error);
      } else {
        resolve('FINISH');
      }
    });
  });
}

async function run() {
  var res = await matchSong(100000);
  var file = await write(res);
  logger.debug(res);
  logger.debug(file);
};
run();
