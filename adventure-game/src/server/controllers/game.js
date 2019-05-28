function prepareData(game, state) {
  return {
    page: state.view,
    player: {name: game.player, badges: game.user.badges},
    newBadges: state.newBadges || []
  };
}

module.exports = function (users, session, config) {
  return {
    index: function (req, res) {
      res.render('games/index', {
        games: req.user.games || [],
        user: req.user
      });
    },

    new: function (req, res) {
      res.render('games/new');
    },

    create: function (req, res, next) {
      if (!req.user.games) {
        req.user.games = [];
      }
      var id = req.user.games.length;
      req.user.games.push({
        id: id,
        player: req.body.player,
        user: session.start({}).user
      });
      users.update(req.user).
        then(function () {
          res.redirect('/games/' + id);
        }, next);
    },

    show: function (req, res) {
      var game = req.user.games[req.params.id];
      if (!game) { return res.status(404).sendFile('404.html', {root: config.public}); }
      var state = session.getPage(game.user);

      res.render('games/show', {
        gameData: prepareData(game, state)
      });
    },

    choose: function (req, res, next) {
      var game = req.user.games[req.params.id];
      if (!game) { return res.status(404).sendFile('404.html', {root: config.public}); }
      var gameState = session.choose(game.user, req.body.alternative);
      game.user = gameState.user;

      users.update(req.user).
        then(function () {
          res.json(prepareData(game, gameState));
        }, next);
    }
  };
};
