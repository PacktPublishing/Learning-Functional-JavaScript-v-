var List = require('immutable').List;
var Map = require('immutable').Map;

function repeat(num, item) {
  var items = [];

  while (num--) {
    items.push(item);
  }

  return List(items);
}

function randomly() {
  return Math.random() - 0.5;
}

logTiles(repeat(3, Map({isMine: true})));

function initTiles(rows, cols, mines) {
  return repeat(mines, Map({isMine: true})).
    concat(repeat(rows * cols - mines, Map({}))).
    sort(randomly).
    map(function (item, idx) {
      return item.set('id', idx);
    });
}

function createGame(options) {
  return Map({
    rows: options.rows,
    cols: options.cols,
    tiles: initTiles(options.rows, options.cols, options.mines)
  });
}

var map = autoCurry(function (fn, coll) {
  return coll.map(fn);
});

function revealMine(tile) {
  return tile.get('isMine') ? tile.set('isRevealed', true) : tile;
}

function revealMines(game) {
  return game.updateIn(['tiles'], map(revealMine));
}

function lose(game) {
  return revealMines(game.set('isDead', true));
}

function revealTile(game, tileId) {
  if (!game.getIn(['tiles', tileId])) {
    return game;
  }
  var updated = game.setIn(['tiles', tileId, 'isRevealed'], true);
  return game.getIn(['tiles', tileId, 'isMine']) ? lose(updated) : updated;
}

var game = createGame({rows: 3, cols: 3, mines: 3});

function pad(str, length) {
  return str + repeat(length - str.length, ' ').join('');
}

function logTiles(tiles) {
  var size = Math.ceil(Math.sqrt(tiles.size));

  var width = tiles.reduce(function (w, tile) {
    return Math.max(w, tile.toString().length);
  }, 0);

  console.log('List[');

  for (var y = 0; y < size; y++) {
    var str = '    ';

    for (var x = 0; x < size && (y * size + x) < tiles.size; x++) {
      str += pad(tiles.get(y * size + x).toString(), width) + '   ';
    }

    console.log(str);
  }

  console.log(']');
}

function curry(fn, args, length) {
  length = length || fn.length;
  return function (arg) {
    var allArgs = (args || []).concat([].slice.call(arguments, 0, 1));

    if (allArgs.length === length) {
      return fn.apply(this, allArgs);
    } else {
      return curry(fn, allArgs);
    }
  };
}

function autoCurry(fn, length) {
  return function (arg) {
    if (arguments.length >= (length || fn.length)) {
      return fn.apply(this, arguments);
    } else {
      return curry(fn, [].slice.call(arguments), length);
    }
  };
}
