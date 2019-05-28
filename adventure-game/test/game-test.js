var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var game = require('../src/game/game');

buster.testCase('game', {
  'getCurrent': {
    setUp: function () {
      this.pages = [
        {id: 1, ast: [
          ['alternative', 2, 'Go further'],
          ['alternative', 3, 'Go even further'],
          ['alternative', 4, 'Eeeeven further']
        ]},
        {id: 2, ast: []},
        {id: 3, ast: [
          ['add-flag', 'ENTERED_AIRPORT'],
          ['cond', ['ENTERED_AIRPORT'], [['add-flag', 'FEARLESS']]],
          ['cond', ['FEARLESS'], [['remove-flag', 'FEARLESS']]]
        ]},
        {id: 4, ast: [
          ['cond', ['FEARLESS'], [
            ['add-flag', 'AWESOME'],
            ['add-flag', 'NICE']
          ]]
        ]}
      ];
    },

    'returns the first page if player has not started': function () {
      var page = game.getCurrent({}, this.pages);
      assert.equals(page.id, 1);
    },

    'returns the user\'s current page': function () {
      var page = game.getCurrent({currentPage: 2}, this.pages);
      assert.equals(page.id, 2);
    },

    'is awarded first-page flag if not started': function () {
      this.pages[0].ast.unshift(['add-flag', 'STARTED_PLAYING']);
      var changes = game.start({}, this.pages);
      assert.match(changes, {currentPage: 1, addFlags: ['STARTED_PLAYING']});
    },

    'choosing an option returns user changes': function () {
      var changes = game.choose({currentPage: 1}, 0, this.pages);
      assert.match(changes, {currentPage: 2});
    },

    'getting page with flags does not re-set flags': function () {
      var changes = game.getCurrent({currentPage: 3}, this.pages);
      refute.match(changes, {addFlags: ['ENTERED_AIRPORT']});
    },

    'entering page with flags sets flags': function () {
      var changes = game.choose({currentPage: 1}, 1, this.pages);
      assert.match(changes, {
        currentPage: 3,
        addFlags: ['ENTERED_AIRPORT']
      });
    },

    'sets conditional flag when requirement is satiesfied': function () {
      var changes = game.choose({
        currentPage: 1,
        flags: ['ENTERED_AIRPORT']
      }, 1, this.pages);

      assert.match(changes, {
        currentPage: 3,
        addFlags: ['FEARLESS']
      });
    },

    'sets all conditional flags': function () {
      var changes = game.choose({
        currentPage: 1,
        flags: ['FEARLESS']
      }, 2, this.pages);

      assert.match(changes, {
        currentPage: 4,
        addFlags: ['AWESOME', 'NICE']
      });
    },

    'entering page may remove flags': function () {
      var changes = game.choose({
        currentPage: 1,
        flags: ['FEARLESS']
      }, 1, this.pages);

      assert.match(changes, {
        currentPage: 3,
        removeFlags: ['FEARLESS']
      });
    }
  }
});
