var bcrypt = require("bcrypt");

function save(user, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return callback(err); }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return callback(err); }
      db.put(user.username, {
        username: user.username,
        salt: salt,
        passwordHash: hash,
        games: []
      }, function (err, user) {
        if (err) { return callback(err); }
        callback(undefined, {
          username: user.username,
          games: user.games
        });
      });
    });
  });
}
