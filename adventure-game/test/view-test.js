var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var view = require('../src/game/view');

buster.testCase('prepare view', {
  'groups plain text into paragraphs': function () {
    var info = view.prepare({ast: [
      ['plainText', 'You are in a'],
      ['plainText', 'cold and dark place']
    ]});

    assert.match(info, {
      paragraphs: ['You are in a\ncold and dark place']
    });
  },

  'separates paragraphs': function () {
    var info = view.prepare({ast: [
      ['plainText', 'You are in a'],
      ['plainText', 'cold and dark place'],
      ['paragraph'],
      ['plainText', 'You are cold']
    ]});

    assert.match(info, {
      paragraphs: [
        'You are in a\ncold and dark place',
        'You are cold'
      ]
    });
  },

  'ignores flags': function () {
    var info = view.prepare({ast: [
      ['cond', ['WAS_THERE', 'BEEN_THERE'], [['remove-flag' , 'BEING_HERE']]],
      ['plainText', 'You are here']
    ]});

    assert.match(info, {paragraphs: ['You are here']});
  },

  'includes alternatives': function () {
    var info = view.prepare({ast: [
      ['plainText', 'You are in a cold and dark place'],
      ['paragraph'],
      ['alternative', 1, 'Go home'],
      ['alternative', 2, 'Go further']
    ]});

    assert.match(info, {
      paragraphs: ['You are in a cold and dark place'],
      alternatives: [
        'Go home',
        'Go further'
      ]
    });
  }
});
