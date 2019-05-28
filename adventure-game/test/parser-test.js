var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var parser = require('../src/game/parser');

buster.testCase('Parser', {
  'parse': {
    'parses plain text-only page': function () {
      var result = parser.parse('You are in a cold and dark place');
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place']
      ]);
    },

    'parses multiple plain text lines': function () {
      var result = parser.parse('You are in a cold and dark place\nYou are cold');
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['plainText', 'You are cold']
      ]);
    },

    'inserts paragraphs for empty lines': function () {
      var result = parser.parse('You are in a cold and dark place\n\nYou are cold');

      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['paragraph'],
        ['plainText', 'You are cold']
      ]);
    },

    'extracts option': function () {
      var result = parser.parse('You are in a cold and dark place\n\n=\n\nGo home\n@1');
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['paragraph'],
        ['alternative', 1, 'Go home']
      ]);
    },

    'extracts multiple options': function () {
      var result = parser.parse(
        'You are in a cold and dark place\n\n=\n\nGo home\n@1\n\nGo further\n@2'
      );
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['paragraph'],
        ['alternative', 1, 'Go home'],
        ['alternative', 2, 'Go further']
      ]);
    },

    'extracts multi-line options': function () {
      var result = parser.parse(
        'You are here\n\n=\n\nGo home\n@1\n\nGo further\nGo really further\n@2'
      );
      assert.equals(result, [
        ['plainText', 'You are here'],
        ['paragraph'],
        ['alternative', 1, 'Go home'],
        ['alternative', 2, 'Go further\nGo really further']
      ]);
    },

    'extracts added flags': function () {
      var result = parser.parse('+ BEING_HERE\nYou are here');

      assert.equals(result, [
        ['add-flag', 'BEING_HERE'],
        ['plainText', 'You are here']
      ]);
    },

    'extracts removed flags': function () {
      var result = parser.parse('- BEING_HERE\nYou are here');

      assert.equals(result, [
        ['remove-flag' , 'BEING_HERE'],
        ['plainText', 'You are here']
      ]);
    },

    'extracts conditional adding of flag': function () {
      var result = parser.parse('? WAS_THERE {\n+ BEING_HERE\n}\nYou are here');

      assert.equals(result, [
        ['cond', ['WAS_THERE'], [['add-flag', 'BEING_HERE']]],
        ['plainText', 'You are here']
      ]);
    },

    'extracts conditional on multiple flags': function () {
      var result = parser.parse('? WAS_THERE, BEEN_THERE {\n+ BEING_HERE\n}\nYou are here');

      assert.equals(result, [
        ['cond', ['WAS_THERE', 'BEEN_THERE'], [['add-flag', 'BEING_HERE']]],
        ['plainText', 'You are here']
      ]);
    },

    'conditionally removes flags': function () {
      var result = parser.parse('? WAS_THERE, BEEN_THERE {\n- BEING_HERE\n}\nYou are here');

      assert.equals(result, [
        ['cond', ['WAS_THERE', 'BEEN_THERE'], [['remove-flag', 'BEING_HERE']]],
        ['plainText', 'You are here']
      ]);
    },

    'supports one-line conditionals': function () {
      var result = parser.parse('? WAS_THERE {- BEING_HERE}');

      assert.equals(result, [['cond', ['WAS_THERE'], [['remove-flag', 'BEING_HERE']]]]);
    },

    'supports weirdly formatted conditionals': function () {
      var result = parser.parse('? WAS_THERE {- BEING_HERE\n+ DOING_DAT}');

      assert.equals(result, [['cond', ['WAS_THERE'], [
        ['remove-flag', 'BEING_HERE'],
        ['add-flag', 'DOING_DAT']
      ]]]);
    },

    'supports escaped brackets in conditional plain text': function () {
      var result = parser.parse('? WAS_THERE {\n' +
                                'Here is some text with an escaped \\} tripping\n' +
                                'you up}');

      assert.equals(result, [['cond', ['WAS_THERE'], [
        ['plainText', 'Here is some text with an escaped \\} tripping'],
        ['plainText', 'you up']
      ]]]);
    },

    'adds flag in one-line conditional': function () {
      assert.equals(parser.parse('? STARTED { +STARTED_2 }'), [
        ['cond', ['STARTED'], [['add-flag', 'STARTED_2']]]
      ]);
    },

    'supports conditional option': function () {
      var result = parser.parse('You are in a cold and dark place\n\n=\n\n? WAS_THERE {\nGo home\n@1\n}');
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['paragraph'],
        ['cond', ['WAS_THERE'], [['alternative', 1, 'Go home']]]
      ]);
    },

    'supports not operator': function () {
      var result = parser.parse('You are in a cold and dark place\n\n=\n\n? !WAS_THERE {\nGo home\n@1\n}');
      assert.equals(result, [
        ['plainText', 'You are in a cold and dark place'],
        ['paragraph'],
        ['cond', ['!WAS_THERE'], [['alternative', 1, 'Go home']]]
      ]);
    },

    'supports mixed normal/not conditionals': function () {
      var result = parser.parse('? WAS_THERE, !BEEN_THERE {\n+ BEING_HERE\n}\nYou are here');

      assert.equals(result, [
        ['cond', ['WAS_THERE', '!BEEN_THERE'], [['add-flag', 'BEING_HERE']]],
        ['plainText', 'You are here']
      ]);
    }
  }
});
