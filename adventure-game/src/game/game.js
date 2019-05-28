var walker = require('./ast-walker');
var alternative = walker.alternative;
var target = walker.target;
var addedFlags = walker.addedFlags;
var removedFlags = walker.removedFlags;
var fn = require('../fn');
var find = fn.find;
var compose = fn.compose;
var eq = fn.eq;
var prop = fn.prop;
var first = fn.first;
var compile = require('./compile');

function getPage(id, pages) {
  return find(compose(eq(id), prop('id')), pages);
}

function enterPage(user, page) {
  var compiled = compile(page, user);
  return {
    currentPage: page.id,
    addFlags: addedFlags(compiled.ast),
    removeFlags: removedFlags(compiled.ast)
  }
}

module.exports = {
  start: function (user, pages) {
    if (user.currentPage) { throw new Error('User is already playing'); }
    return enterPage(user, first(pages));
  },

  getCurrent: function (user, pages) {
    return compile(
      user.currentPage ? getPage(user.currentPage, pages) : first(pages),
      user
    );
  },

  choose: function (user, option, pages) {
    var page = getPage(user.currentPage, pages);
    return enterPage(user, getPage(target(alternative(compile(page, user), option)), pages));
  }
};
