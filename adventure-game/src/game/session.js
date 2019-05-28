var game = require('./game');
var awardBadges = require('./badges').award;
var merge = require('./changeset').merge;
var prepareView = require('./view').prepare;

exports.createSession = function (pages, badgeDefs) {
  function applyChanges(user, changes) {
    var updated = merge(user, changes);
    var badges = awardBadges(updated, badgeDefs);
    updated.badges = (updated.badges || []).concat(badges);
    return {
      user: updated,
      view: prepareView(game.getCurrent(updated, pages)),
      newBadges: badges
    };
  }

  return {
    start: function (user) {
      return applyChanges(user, game.start(user, pages));
    },

    getPage: function getPage(user) {
      return {view: prepareView(game.getCurrent(user, pages))};
    },

    choose: function choose(user, choice) {
      return applyChanges(user, game.choose(user, choice, pages));
    }
  };
};
