/*global React, createGame */
var partition = require('./src/util').partition;
var div = React.DOM.div;
var span = React.DOM.span;
var button = React.DOM.button;
var createGame = require('./src/game').createGame;
var revealTile = require('./src/game').revealTile;
var isGameOver = require('./src/game').isGameOver;
var List = require('immutable').List;




















function createComponent(render) {
  var component = React.createFactory(React.createClass({
    shouldComponentUpdate: function (newProps) {
      return this.props.data !== newProps.data;
    },

    render: function () {
      return render(this.props.data);
    }
  }));

  return function (data) {
    return component({data: data});
  };
}

















































var Row = createComponent(function (tiles) {
  return div({className: 'row'}, tiles.map(Tile).toJS());
});

var Board = createComponent(function (game) {
  return div({
    className: 'board'
  }, partition(game.get('cols'), game.get('tiles')).map(Row).toJS());
});




















var Tile = createComponent(function (tile) {
  if (tile.get('isRevealed')) {
    return div({className: 'tile' + (tile.get('isMine') ? ' mine' : '')},
               tile.get('threatCount') > 0 ? tile.get('threatCount') : '');
  }

  return div({
    className: 'tile',
    onClick: function () {
      clickTile(tile.get('id'));
    }
  }, div({className: 'lid'}, ''));
});
























var div = React.DOM.div;

var UndoButton = createComponent(function () {
  return button({onClick: undo}, 'Undo');
});

var GameUI = createComponent(function (game) {
  return div({}, Board(game), UndoButton());
});
























var game = createGame({cols: 16, rows: 16, mines: 48});
var gameHistory = List();

function undo() {
  if (gameHistory.size > 0) {
    game = gameHistory.last();
    gameHistory = gameHistory.pop();
    render();
  }
}

function clickTile(tileId) {
  gameHistory = gameHistory.push(game);
  game = revealTile(game, tileId);
  render();
}

function render() {
  React.render(GameUI(game), document.getElementById('board'));
}

render();





console.time('Play');

game.get('tiles').forEach(function (tile) {
  if (!tile.get('isMine')) {
    clickTile(tile.get('id'));
  }
});

console.timeEnd('Play');
