/*global React*/
var d = React.DOM;

function when(pred, then) {
  if (!pred) { return null; }
  return then.apply(this, [].slice.call(arguments, 2));
}

function createComponent(render) {
  var comp = React.createFactory(React.createClass({
    render: function () {
      return render(this.props.data);
    }
  }));

  return function (data) {
    return comp({data: data});
  };
}

var player = createComponent(function (player) {
  return d.h5({className: 'mbl'},
              player.name,
              player.dead ? d.strong({className: 'warn'}, ' was ') : ' is ',
              'playing 2112',
              when(player.badges.length > 0,
                   d.span, {className: 'right'},
                   player.badges.length + ' badge' + (player.badges.length > 1 ? 's' : ''))
             );
});

var gameOver = function (game) {
  if (!game.player.dead) {
    return null;
  }
  return d.p({}, 'Game over!', d.br({}), d.a({href: '/games/new'}, 'Go again'));
};

module.exports = function (api) {
  var alternatives = createComponent(function (alts) {
    return d.div({}, alts.map(function (alt, i) {
      return d.div({
        key: i,
        className: 'mvs mod option'
      }, d.button({
        onClick: function (e) {
          api.choose(i);
          e.preventDefault();
        },
        className: 'clickable'
      }, alt));
    }));
  });

  return createComponent(function (game) {
    return d.div(
      {},
      player(game.player),

      when(game.newBadges && game.newBadges.length > 0,
           d.h2, {}, 'You earned new badges!'),

      (game.newBadges || []).map(function (badge) {
        return d.p({}, d.strong({}, badge.title));
      }),

      game.page.paragraphs.map(function (paragraph, i) {
        return d.p({key: i, className: 'text'}, paragraph);
      }),

      alternatives(game.page.alternatives),

      gameOver(game)
    );
  })
};
