'user strict';

const logger = require('../logger');
const matchSong = require('../matchSong/promise');

var list = [];
for (var i = 100000; i < 100005; ++ i) {
  matchSong.matchSongPromise(i).then(function(value) {
    list.push(value);
  });
}

var timer = setInterval(function () {
  if (list.length === 5) {
    clearInterval(timer);
    logger.debug(list);
  }
}, 10);
