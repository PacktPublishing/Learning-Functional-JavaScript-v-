'use strict';
var authController = require('./controllers/auth');
var usersController = require('./controllers/users');
var gameController = require('./controllers/game');

module.exports = function (app, config, userDb) {
  var auth = authController(app, userDb);
  app.post('/sessions', auth.login);
  app.get('/logout', auth.logout);

  var membersOnly = auth.guard(app);

  var users = usersController(userDb, auth);
  app.get('/users/new', users.new);
  app.post('/users', users.create);

  var game = gameController(userDb, app.get('game-session'), config);
  membersOnly.get('/', function (req, res) { res.redirect('/games'); });
  membersOnly.get('/games', game.index);
  membersOnly.get('/games/new', game.new);
  membersOnly.post('/games', game.create);
  membersOnly.get('/games/:id', game.show);
  membersOnly.post('/games/:id', game.choose);
};
