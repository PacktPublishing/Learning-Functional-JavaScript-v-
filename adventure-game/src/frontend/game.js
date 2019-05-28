/*global React, reqwest*/
require('es6-promise').polyfill();
var fn = require('../fn');
var compose = fn.compose;
var prop = fn.prop;
var EventEmitter = require('events').EventEmitter;
var hub = new EventEmitter();

var gameUI = require('./ui/game')({
  choose: function (alt) {
    reqwest({
      url: window.location.href,
      method: 'post',
      type: 'json',
      data: {alternative: alt}
    }).
      then(hub.emit.bind(hub, 'data')).
      catch(compose(console.log, prop('stack')));
  }
});

function render(data) {
  console.log(data);
  if (data.page.alternatives.length === 0) {
    data.player.dead = true;
  }
  React.render(gameUI(data), document.getElementById('game'));
}

hub.on('data', render);
render(JSON.parse(document.getElementById('data').innerHTML));
