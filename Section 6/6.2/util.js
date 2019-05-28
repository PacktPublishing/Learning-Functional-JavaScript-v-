global.curry = function curry(fn, args, length) {
  return function (arg) {
    var allArgs = (args || []).concat([].slice.call(arguments, 0, 1));
    length = length || fn.length;
    if (allArgs.length < length) {
      return curry(fn, allArgs);
    }
    return fn.apply(this, allArgs);
  };
}

global.autoCurry = function autoCurry(fn, length) {
  length = length || fn.length;
  return function () {
    if (arguments.length >= length) {
      return fn.apply(this, arguments);
    } else {
      return curry(fn, [].slice.call(arguments, 0));
    }
  };
}

global.partial = function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
};

global.nth = autoCurry(function (n, list) {
  return list[n];
});

global.first = partial(nth, 0);
global.second = partial(nth, 1);

global.eq = autoCurry(function (val, other) {
  return val === other;
});

global.compose = function compose() {
  var fns = [].slice.call(arguments).reverse();
  return function () {
    return first(fns.reduce(function (args, fn) {
      return [fn.apply(null, args)];
    }, arguments));
  };
};

global.identity = function (v) { return v; };

global.rest = function (list) {
  return list.slice(1);
};

global.makeList = function (first, rest) {
  return [first].concat(rest);
};

global.prop = autoCurry(function (prop, obj) {
  return obj[prop];
});
