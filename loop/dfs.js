'user strict';

const logger = require('../logger');
const matchSong = require('../matchSong/promise');

function dfs(songId, list) {
  if (list.length === 5) {
    return logger.debug(list);
  }

  matchSong.matchSongPromise(songId).then(function(value) {
    list.push(value);
    dfs(songId + 1, list);
  });
}

dfs(100000, []);
