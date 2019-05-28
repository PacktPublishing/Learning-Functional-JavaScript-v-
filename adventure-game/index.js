'use strict';
var http = require('http');
var system = require('./src/server/system');
var config = require('./config');

system.createApp(config).then(function (application) {
  var app = system.routeApp(application, config);
  http.createServer(app).listen(config.port, function () {
    console.log("Have an adventurous gaming session on http://localhost:" + config.port);
  });
}).catch(function (err) {
  console.log('Failed to initialize system');
  console.log(err.stack);
  process.exit(1);
});
