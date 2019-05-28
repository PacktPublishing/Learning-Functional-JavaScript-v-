module.exports = [
  {
    id: 1,
    title: 'n00b',
    earned: function (user) {
      return user.currentRoom !== 0 && !user.badges;
    }
  },

  {
    id: 2,
    title: 'Patient adventurer',
    earned: function (user) {
      return user.flags.indexOf('ROCINANTE') >= 0;
    }
  }
];
