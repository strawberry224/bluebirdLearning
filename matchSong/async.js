'user strict';

const async = require('async');
const crypto = require('../cryptoData');
const fs = require('fs');
const logger = require('../logger');
const settings = require('../settings');
const request = require('request');

function matchSong(songId) {
  const url = `${settings.baseUrl}v1/resource/comments/R_SO_4_${songId}/?csrf_token=`;
  const text = JSON.stringify({'username': '', 'password': '', 'rememberLogin': 'true'});
  const form = crypto.getData(text);
  const options = {url: url, headers: settings.headers, form: form};

  async.waterfall([
    function(callback) {
      request.post(options, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          return callback(error);
        }
        callback(null, body);
      });
    },
    function(value, callback) {
      fs.appendFile('./matchSong/tmp.txt', value, 'utf8', function(error) {
        if(error) {
          return callback(error);
        }
        callback(null, 'FINISH');
      });
    }
  ], function(error, result) {
    if (error) {
      logger.error(error);
    }
    logger.debug(result);
  });
}

matchSong(100000);
