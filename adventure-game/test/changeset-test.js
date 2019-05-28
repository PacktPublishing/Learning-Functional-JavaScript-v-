var buster = require('buster');
var assert = buster.assert;
var changeset = require('../src/game/changeset');

buster.testCase('Merge changeset', {
  'returns new user': function () {
    var user = changeset.merge({flags: []}, {currentPage: 1});
    assert.match(user, {currentPage: 1, flags: []});
  },

  'updates currentPage': function () {
    var user = changeset.merge({currentPage: 1, flags: []}, {currentPage: 2});
    assert.match(user, {currentPage: 2, flags: []});
  },

  'keeps existing flags': function () {
    var user = changeset.merge({
      currentPage: 1,
      flags: ['BEING_BRAVE']
    }, {currentPage: 2});

    assert.match(user, {
      flags: ['BEING_BRAVE'],
      currentPage: 2
    });
  },

  'does not preserve lost flags': function () {
    var user = changeset.merge({
      currentPage: 1,
      flags: ['BEING_BRAVE']
    }, {currentPage: 2, removeFlags: ['BEING_BRAVE']});

    assert.match(user, {
      flags: [],
      currentPage: 2
    });
  },

  'adds new flags': function () {
    var user = changeset.merge({
      currentPage: 1,
      flags: ['BEING_BRAVE']
    }, {currentPage: 2, addFlags: ['FEARLESS']});

    assert.match(user, {
      flags: ['BEING_BRAVE', 'FEARLESS'],
      currentPage: 2
    });
  },

  'adds page to history': function () {
    var user = changeset.merge({currentPage: 1, pages: [1]}, {currentPage: 2});

    assert.match(user, {
      pages: [1, 2]
    });
  },

  'preserves user custom data': function () {
    var user = changeset.merge({currentPage: 1, data: {}}, {currentPage: 2});

    assert.match(user, {data: {}});
  }
});
