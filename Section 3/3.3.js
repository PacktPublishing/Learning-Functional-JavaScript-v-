var bcrypt = require('bcrypt');
var genSalt = promisify(bcrypt.genSalt);
var genHash = promisify(bcrypt.hash);
var dbPut = promisify(db.put);

function prepareUser(user) {
  return {
    username: user.username,
    games: user.games
  };
}

function persistUser(user) {
  return function (res) {
    return dbPut(user.username, {
      username: user.username,
      salt: res[0],
      passwordHash: res[1],
      games: []
    })
  };
}

function save(user, callback) {
  var salt = genSalt(10);
  var hash = salt.then(function (salt) {
    return genHash(user.password, salt);
  });

  return Promise.all([salt, hash])
    .then(persistUser(user))
    .then(prepareUser);
}
