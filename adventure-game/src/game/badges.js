var fn = require('../fn');
var not = fn.not;
var contained = fn.contained;
var compose = fn.compose;
var prop = fn.prop;

function prep(badge) {
  return Object.keys(badge).reduce(function (res, prop) {
    if (typeof badge[prop] !== 'function') {
      res[prop] = badge[prop];
    }
    return res;
  }, {});
}

var getId = prop('id');

exports.award = function (user, badges) {
  return badges.
    filter(not(compose(contained((user.badges || []).map(getId)), getId))).
    reduce(function (awarded, badge) {
      return awarded.concat(badge.earned(user) ? prep(badge) : []);
    }, []);
};
