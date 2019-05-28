function merge() {
  return [].reduce.call(arguments, function (res, obj) {
    return Object.keys(obj).reduce(function (res, prop) {
      res[prop] = obj[prop];
      return res;
    }, res);
  }, {});
}

function not(fn) {
  return function (val) {
    return !fn(val);
  };
}

function contained(list) {
  return function (item) {
    return list.indexOf(item) >= 0;
  };
}

function applyChangeset(user, changes) {
  return merge({
    flags: user.flags.filter(not(contained(changes.removeFlags))).
      concat(changes.addFlags),
    currentPage: changes.currentPage,
    pages: user.pages.concat(changes.currentPage)
  });
}

var user = {
  name: 'Chris',
  flags: ['n00b'],
  pages: [0]
};

var changeset = {
  removeFlags: ['n00b', 'advanced'],
  addFlags: ['beginner'],
  currentPage: 1
};

console.log(applyChangeset(user, changeset));
