var fs = require('fs');
var path = require('path');
var readFile = promisify(fs.readFile);
var readdir = promisify(fs.readdir);
var parser = require('./parser');

function partial(fn) {
  var args = [].slice.call(arguments, 1);

  return function () {
    var allArgs = args.concat([].slice.call(arguments));
    return fn.apply(null, allArgs);
  };
}

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

function unary(fn) {
  return function () {
    return fn.apply(this, [].slice.call(arguments, 0, 1));
  };
}

function sortBy(fn, coll) {
  return coll.sort(function (a, b) {
    var pa = fn(a), pb = fn(b);
    if (pa < pb) { return -1; }
    if (pa > pb) { return 1; }
    return 0;
  });
}

function prop(name) {
  return function (obj) {
    return obj[name];
  };
}

var sortById = partial(sortBy, prop('id'));

function parseDir(dir) {
  return readdir(dir).
    then(function (entries) {
      var joinDir = unary(partial(path.join, dir));
      return Promise.all(entries.map(joinDir).map(parseFile));
    }).
    then(sortById);
}
