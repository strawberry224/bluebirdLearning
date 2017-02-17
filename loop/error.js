'user strict';

const logger = require('../logger');
const matchSong = require('../matchSong/promise');

var list = [];
for (var i = 100000; i < 100001; ++ i) {
  list.push(matchSong.matchSongPromise(i));
}

logger.debug(list);
