var buster = require('buster');
var assert = buster.assert;
var compile = require('../src/game/compile');

buster.testCase('Compile', {
  'removes unmet conditionals': function () {
    var page = {
      id: 0,
      ast: [
        ['add-flag', 'STARTED'],
        ['cond', ['STARTED'], [['add-flag', 'STARTED_2']]],
        ['cond', ['STARTED_2'], [['add-flag', 'STARTED_3']]],
        ['cond', ['STARTED_3'], [['add-flag', 'STARTED_4']]],
        ['cond', ['STARTED_4'], [['add-flag', 'STARTED_5']]],
        ['paragraph'], ['plainText', 'You are in a vast desert.'],
        ['paragraph'],
        ['cond', ['STARTED_5'], [['plainText', 'You sure are persistent. Now get moving.']]],
        ['paragraph'],
        ['cond', ['STARTED'], [['alternative', 1, 'Head north']]],
        ['alternative', 2, 'Head south'],
        ['alternative', 0, 'Hang around']
      ]
    };

    var user = {
      flags: [],
      currentPage: 0,
      pages: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      badges: [{title: 'n00b'}]
    };

    assert.equals(compile(page, user), {
      id: 0,
      ast: [
        ['add-flag', 'STARTED'],
        ['paragraph'], ['plainText', 'You are in a vast desert.'],
        ['paragraph'],
        ['paragraph'],
        ['alternative', 2, 'Head south'],
        ['alternative', 0, 'Hang around']
      ]
    });
  },

  'inlines satiesfied conditionals': function () {
    var page = {
      id: 0,
      ast: [
        ['add-flag', 'STARTED'],
        ['cond', ['STARTED'], [['add-flag', 'STARTED_2']]],
        ['cond', ['STARTED_2'], [['add-flag', 'STARTED_3']]],
        ['cond', ['STARTED_3'], [['add-flag', 'STARTED_4']]],
        ['cond', ['STARTED_4'], [['add-flag', 'STARTED_5']]],
        ['paragraph'], ['plainText', 'You are in a vast desert.'],
        ['paragraph'],
        ['cond', ['STARTED_5'], [['plainText', 'You sure are persistent. Now get moving.']]],
        ['paragraph'],
        ['alternative', 1, 'Head north'],
        ['alternative', 2, 'Head south'],
        ['alternative', 0, 'Hang around']
      ]
    };

    var user = {
      "flags": ['STARTED'],
      "current": 0,
      "pages": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "badges": [{title: 'n00b'}]
    };

    assert.equals(compile(page, user), {
      id: 0,
      ast: [
        ['add-flag', 'STARTED_2'],
        ['paragraph'],
        ['plainText', 'You are in a vast desert.'],
        ['paragraph'],
        ['paragraph'],
        ['alternative', 1, 'Head north'],
        ['alternative', 2, 'Head south'],
        ['alternative', 0, 'Hang around']
      ]
    });
  },

  'supports the not operator for flag conditionals': function () {
    var page = {
      id: 0,
      ast: [['cond', ['!STARTED'], [['add-flag', 'STARTED_2']]]]
    };

    var user = {flags: [], current: 0, pages: [], badges: []};

    assert.equals(compile(page, user), {
      id: 0,
      ast: [
        ['add-flag', 'STARTED_2']
      ]
    });
  }
});
