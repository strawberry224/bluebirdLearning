'user strict';

const _ = require('underscore');
const fs = require('fs');
const logger = require('./logger');
const request = require('request');

function post() {
  const url = `${settings.baseUrl}/v3/playlist/detail?csrf_token=9d0873be2ecc34af09dcf7dc3660232c`;
  const form = {
    'params':'pLg+LuyA3Anrp45tjUXNvERUBsOEnHfNHkNVuQ+lsZzO6viYvx0RcSF2yOFQOyVQweGFNAiugY8ouVrr51kXR5JUeHCoLdRA1XwAt53ECKaW3u6+t29dnWW+j5i+yzfH/xCj9u7OxQQOVNFjiIWpFbiXwWrfF/TteOBC0wjZkqEyXLBpjoopDQqtAgpBwQO3aS47LykrWnkr5mCIFsHy7a/x4hmQ/ONk/YWOqRN3M3I=',
    'encSecKey':'7304d83e9d417454ddd4c2566cea0bcc2e5f22ad111c6745b5f569452d9ecbf74ff67755bd5fa92a4134decf090cb1da6011f463f660c421c6d11d9f6bb5c83798cb4916f6caa54a353f8c625d85542e3b12aeda0304dc279328debfb0545b6f43c64d4d0bbffc32fd0979b1f174a9258488302ab6bd228240057024681922d6'
  };
  const options = {url: url, form: form};

  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        var tracks = JSON.parse(body).playlist.trackIds;
        tracks = _.pluck(tracks, 'id');
        resolve(tracks);
      }
    });
  });
}

function read() {
  return new Promise(function(resolve, reject) {
    fs.readFile('songId.txt', function (error, data) {
      if (error) {
        return logger.error(error);
      }
      var lines = data.toString().split('\n');

      readLines(lines, function(error, list) {
        if (error) {
          reject(error);
        } else {
          resolve(list);
        }
      }, []);
    });
  });
}

function readLines(lines, callback, list) {
  if (lines.length === 0) {
    return callback(null, list);
  }

  var line = lines.shift();
  if (line) {
    list.push(parseInt(line));
  }

  readLines(lines, callback, list);
}

Promise.all([read(), post()]).then(function(value) {
  var willLike = _.difference(value[0], value[1]).join('\n');
  logger.info(willLike);

  fs.writeFile('like.txt', willLike,  function(error) {
    if (error) {
      logger.error(error);
    }
  });
}).catch(function(error) {
  logger.error(error);
});
