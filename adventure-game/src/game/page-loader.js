var fs = require('fs');
var path = require('path');
var Promise = require('es6-promise').Promise;
var parser = require('./parser');
var fn = require('../fn');
var unary = fn.unary;
var partial = fn.partial;
var promisify = fn.promisify;
var sortBy = fn.sortBy;
var prop = fn.prop;
var readFile = promisify(fs.readFile);
var readdir = promisify(fs.readdir);
var sortById = sortBy(prop('id'));

function getFileId(file) {
  return parseInt(file.split('/').pop().split('.')[0]);
}

function createPage(id, content) {
  return {
    id: id,
    ast: parser.parse(content)
  };
}

function parseFile(file) {
  return readFile(file, 'utf-8').
    then(partial(createPage, getFileId(file)));
}

function parseDir(dir) {
  return readdir(dir).
    then(function (entries) {
      var joinPath = unary(partial(path.join, dir));
      return Promise.all(entries.
                         map(joinPath).
                         map(parseFile));
    }).
    then(sortById);
}

module.exports = {
  parseFile: parseFile,
  parseDir: parseDir
};
