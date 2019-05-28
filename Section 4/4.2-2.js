var fs = require('fs');
var path = require('path');
var readFile = promisify(fs.readFile);
var readdir = promisify(fs.readdir);
var parser = require('./parser');

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
    var args = [].slice.call(arguments, 0, 1);
    return fn.apply(null, args);
  };
}

var sortBy = autoCurry(function (fn, coll) {
  return coll.sort(function (a, b) {
    var pa = fn(a), pb = fn(b);
    if (pa < pb) { return -1; }
    if (pa > pb) { return 1; }
    return 0;
  });
});

var prop = autoCurry(function (name, obj) {
  return obj[name];
});

var sortById = sortBy(prop('id'));

function parseDir(dir) {
  return readdir(dir).
    then(function (entries) {
      var joinPath = unary(partial(path.join, dir));
      return Promise.all(entries.map(joinPath).map(parseFile));
    }).
    then(sortById);
}

function promisify(fn) {
  return function () {
    var args = [].slice.call(arguments);
    var self = this;
    return new Promise(function (resolve, reject) {
      fn.apply(self, args.concat(function (err, result) {
        if (err) { return reject(err); }
        resolve(result);
      }));
    });
  };
}
function curry(fn, args, length) {
  length = length || fn.length;
  return function (arg) {
    var allArgs = (args || []).concat([].slice.call(arguments, 0, 1));

    if (allArgs.length === length) {
      return fn.apply(this, allArgs);
    } else {
      return curry(fn, allArgs);
    }
  };
}

function autoCurry(fn, length) {
  return function () {
    if (arguments.length >= (length || fn.length)) {
      return fn.apply(this, arguments);
    } else {
      return curry(fn, [], length);
    }
  };
}

function nth(n, list) {
  return list[n];
}

var second = curry(nth, 1);

function partial(fn) {
  var args = [].slice.call(arguments, 1);

  return function () {
    var allArgs = args.concat([].slice.call(arguments));
    return fn.apply(null, allArgs);
  };
}
