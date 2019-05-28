var fn = require('../fn');
var find = fn.find;
var compose = fn.compose;
var eq = fn.eq;
var contained = fn.contained;
var not = fn.not;
var identity = fn.identity;
var mapcat = fn.mapcat;
var empty = [];

function meetsFlagDemands(user, flags) {
  var userFlags = user.flags || [];
  return flags.reduce(function (res, flag) {
    if (/^!/.test(flag)) {
      return res && userFlags.indexOf(flag.slice(1)) < 0;
    } else {
      return res && userFlags.indexOf(flag) >= 0;
    }
  }, true);
}

function hasFlags(user, flags) {
  return !find(not(contained(user.flags)), flags);
}

function pruneFlags(user) {
  return function (nodes) {
    return nodes.map(function (node) {
      if (!node) { return empty; }
      if (node[0] === 'remove-flag' && hasFlags(user, node[1])) {
        return node;
      }
      return node[0] === 'add-flag' && hasFlags(user, [node[1]]) ? undefined : node;
    }).filter(identity);
  };
}

function evaluateCond(user) {
  return function (node) {
    if (node[0] === 'cond') {
      return meetsFlagDemands(user, node[1]) ? node[2] : empty;
    }
    return [node];
  };
}

module.exports = function compile(page, user) {
  return {
    id: page.id,
    ast: mapcat(compose(pruneFlags(user), evaluateCond(user)), page.ast)
  };
}
