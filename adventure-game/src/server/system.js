var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var levelup = require('levelup');
var userDb = require('./user-db');
var FileStore = require('session-file-store')(session);
var browserify = require('browserify-middleware');
var os = require('os');
var fs = require('fs');
var Promise = require('es6-promise').Promise;
var game = require('../game');
var pageLoader = game.pageLoader;
var createGameSession = game.session.createSession;

var routes = require('./routes');

function serveNodeModule(path, contentType) {
  var normalize = new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf-8', function (err, content) {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });

  return function (req, res) {
    normalize.then(function (content) {
      res.contentType(contentType).send(content);
    }, function (err) {
      res.status(500).send(err.stack);
    });
  };
}

exports.createApp = function (config) {
  var app = express();
  config = config || {};

  app.use(logger('combined'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(config.public));
  app.set('views', config.views);
  app.set('view engine', 'ejs');

  app.use(session({
    secret: 'syrinx',
    saveUninitialized: true,
    resave: false,
    store: new FileStore({path: os.tmpdir()})
  }));

  app.get('/styles/normalize.css', serveNodeModule(config.root + '/node_modules/normalize.css/normalize.css', 'text/css'));
  app.get('/scripts/react.js', serveNodeModule(config.root + '/node_modules/react/dist/react-with-addons.js', 'text/javascript'));
  app.get('/scripts/reqwest.js', serveNodeModule(config.root + '/node_modules/reqwest/reqwest.min.js', 'text/javascript'));
  app.get('/scripts/game.js', browserify(config.root + '/src/frontend/game.js'));

  return pageLoader.parseDir(config.pages).then(function (pages) {
    app.set('game-session', createGameSession(pages, require('./badges')));
    return app;
  });
};

exports.routeApp = function (app, config) {
  routes(app, config, userDb(levelup(config.userDb, {valueEncoding: 'json'})));
  return app;
};
