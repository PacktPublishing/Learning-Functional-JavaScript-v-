var bcrypt = require('bcrypt');

function series(steps, callback) {
  var stepfns = steps.slice();

  function doNext() {
    var next = stepfns.shift();
    var args = [].slice.call(arguments);

    if (next) {
      next.apply(null, args.concat(function (err, result) {
        if (err) { return callback(err); }
        doNext(result);
      }));
    } else {
      callback.apply(null, [undefined].concat(args));
    }
  }

  doNext();
}

function save(user, callback) {
  series([
    function (next) {
      bcrypt.genSalt(10, next);
    },
    function (salt, next) {
      bcrypt.hash(user.password, salt, next);
    },
    function (hash, next) {
      db.put(user.username, {
        username: user.username,
        salt: salt,
        passwordHash: hash,
        games: []
      }, next);
    }
  ], function (err, user) {
    if (err) { return callback(err); }
    callback(undefined, {
      username: user.username,
      games: user.games
    });
  });
}
