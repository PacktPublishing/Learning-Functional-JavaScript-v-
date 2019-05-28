var fn = require('../fn');
var contained = fn.contained;
var not = fn.not;
var merge = fn.merge;

exports.merge = function (user, changes) {
  return merge(user, {
    flags: (user.flags || []).
      filter(not(contained(changes.removeFlags))).
      concat(changes.addFlags || []),
    currentPage: changes.currentPage,
    pages: (user.pages || []).concat(changes.currentPage)
  });
};
