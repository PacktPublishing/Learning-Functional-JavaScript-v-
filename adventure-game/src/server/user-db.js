var bcrypt = require('bcryptjs');
var fn = require('../fn');
var pluck = fn.pluck;
var promisify = fn.promisify;
var partial = fn.partial;
var Promise = require('es6-promise').Promise;
var genSalt = promisify(bcrypt.genSalt);
var genHash = promisify(bcrypt.hash);
var compare = promisify(bcrypt.compare);

module.exports = function (_db) {
  var get = promisify(_db.get.bind(_db));
  var _put = promisify(_db.put.bind(_db));

  var put = function (id, obj) {
    return _put(id, obj).then(function () { return obj; });
  };

  function loginError(message) {
    var err = new Error(message);
    err.loginError = true;
    throw err;
  }

  function validationError(message) {
    var err = new Error(message);
    err.validationError = true;
    err.toJSON = function () {
      return {message: message};
    };
    return new Promise(function (resolve, reject) {
      reject(err);
    });
  }

  function prepareUser(user) {
    return {
      username: user.username,
      games: user.games
    };
  }

  function persistUser(user) {
    return function (res) {
      return put(user.username, {
        username: user.username,
        salt: res[0],
        passwordHash: res[1],
        games: []
      });
    };
  }

  function save(user) {
    var salt = genSalt(10);
    var hash = salt.then(function (salt) {
      return genHash(user.password, salt);
    });

    return Promise.all([salt, hash])
      .then(persistUser(user))
      .then(prepareUser);
  }

  return {
    get: get,

    create: function (user) {
      if (!user || !user.username) {
        return validationError('Please enter a username');
      }

      if (!user.password) {
        return validationError('Please enter a password');
      }

      return get(user.username).
        then(function (existing) {
          if (existing) {
            return validationError('Username is taken, use another one');
          }
        }, function () {
          return save(user);
        });
    },

    update: function (user) {
      return put(user.username, user).
        then(pluck(['username', 'games']));
    },

    authenticate: function (username, pass, callback) {
      return get(username).
        then(function (user) {
          return {user: user, result: compare(pass, user.passwordHash)};
        }).
        then(function (login) {
          if (!login.result) {
            loginError('Wrong password');
          } else {
            return login.user
          }
        }).
        catch(partial(loginError, 'Unknown user'));
    }
  };
};
