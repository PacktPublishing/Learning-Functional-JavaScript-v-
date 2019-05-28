module.exports = function (users, auth) {
  return {
    new: function (req, res) {
      res.render('users/new');
    },

    create: function (req, res, next) {
      users.create({
        username: req.body.username,
        password: req.body.password
      }).then(function (user) {
        req.logIn(user, res.redirect.bind(res, '/'));
      }, function (err) {
        res.render('users/new', {error: err.message});
      });
    }
  };
};
