var second = require('../fn').second;

function nodesByTypes(types, ast) {
  return ast.filter(function (node) {
    return types.indexOf(node[0]) >= 0;
  });
}

function alternatives(page) {
  return nodesByTypes(['alternative'], page.ast);
}

module.exports = {
  alternatives: alternatives,
  nodesByTypes: nodesByTypes,

  alternative: function (page, option) {
    return alternatives(page)[option];
  },

  target: function (alternative) {
    return second(alternative);
  },

  addedFlags: function (ast) {
    return nodesByTypes(['add-flag'], ast).map(second);
  },

  removedFlags: function (ast) {
    return nodesByTypes(['remove-flag'], ast).map(second);
  }
};
