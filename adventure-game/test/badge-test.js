var buster = require('buster');
var assert = buster.assert;
var sinon = buster.sinon;
var award = require('../src/game/badges').award;

var yes = sinon.stub().returns(true);
var no = sinon.stub().returns(false);

buster.testCase('Award badges', {
  'runs through all badge functions': function () {
    var user = {};
    var badges = [
      {earned: sinon.spy()},
      {earned: sinon.spy()},
      {earned: sinon.spy()}
    ];
    award(user, badges);

    assert.calledOnceWith(badges[0].earned, user);
    assert.calledOnceWith(badges[1].earned, user);
    assert.calledOnceWith(badges[2].earned, user);
  },

  'awards badge when earned function returns true': function () {
    var badges = award({}, [{title: 'Yuppie', earned: yes}]);
    assert.equals(badges, [{title: 'Yuppie'}]);
  },

  'does not award duplicate badges': function () {
    var badges = award({badges: [{id: 1}]}, [{id: 1, title: 'Yuppie', earned: yes}]);
    assert.equals(badges, []);
  }
});
