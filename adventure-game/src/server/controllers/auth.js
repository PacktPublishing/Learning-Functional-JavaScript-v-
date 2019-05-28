var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, users) {
  passport.use(new LocalStrategy(function (username, password, done) {
    users.authenticate(username, password).
      then(function (user) {
        done(null, user);
      }, function (err) {
        if (err.loginError) {
          return done(null, false, err);
        }
        done(err);
      });
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) { done(null, user); });
  passport.deserializeUser(function(user, done) { done(null, user); });

  var login = passport.authenticate('local');

  function guardedRoute(app, method) {
    return function (route, handler) {
      app[method](route, function (req, res) {
        if (!req.user) {
          return res.redirect('/login/');
        }
        handler.apply(this, arguments);
      });
    }
  }

  return {
    login: passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    }),

    logout: function(req, res) {
      var username = req.user && req.user.username;
      req.logout();
      res.redirect('/login/');
      req.session.notice = 'You have successfully been logged out ' + username;
    },

    guard: function (app) {
      return {
        get: guardedRoute(app, 'get'),
        post: guardedRoute(app, 'post')
      };
    }
  };
};
