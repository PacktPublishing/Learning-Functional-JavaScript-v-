var filterById = autoCurry(function (id, item) {
  return id === item.id;
});

var find = autoCurry(function (pred, coll) {
  for (var i = 0, l = coll.length; i < l; i++) {
    if (pred(coll[i])) {
      return coll[i];
    }
  }
});

var eq = autoCurry(function (v1, v2) {
  return v1 === v2;
});

function getPage(id, pages) {
  return find(compose(eq(id), prop('id')), pages);
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

var prop = autoCurry(function (name, obj) {
  return obj[name];
});
