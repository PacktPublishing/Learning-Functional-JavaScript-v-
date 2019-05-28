var Promise = require('es6-promise').Promise;

function slice() {
  return [].slice.call.apply([].slice, arguments);
}

function concat() {
  var args = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    args = args.concat(arguments[i].slice ? arguments[i] : slice(arguments[i]));
  }
  return args;
}

function partial(fn) {
  var args = slice(arguments, 1);
  return function () {
    return fn.apply(this, concat(args, arguments));
  };
}

function curry(fn, length, args) {
  length = length || fn.length;
  return function () {
    var allArgs = concat(args || [], slice(arguments, 0, 1));
    if (allArgs.length < length) {
      return curry(fn, allArgs);
    } else {
      return fn.apply(this, allArgs);
    }
  };
}

function autoCurry(fn, length) {
  length = length || fn.length;
  return function () {
    if (arguments.length >= length) {
      return fn.apply(this, arguments);
    } else {
      return curry(fn, length, slice(arguments));
    }
  };
}

var prop = autoCurry(function prop(p, obj) {
  return obj[p];
});

var nth = prop;

module.exports = {
  slice: slice,
  concat: concat,
  prop: prop,
  partial: partial,
  nth: nth,
  first: nth(0),
  second: nth(1),
  third: nth(2),

  rest: function (coll) {
    return slice(coll, 1);
  },

  func: function (meth) {
    var args = slice(arguments, 1);
    return function (obj) {
      return obj[meth].apply(obj, concat(args, slice(arguments, 1)));
    };
  },

  when: autoCurry(function (pred, func) {
    var args = slice(arguments, 2);
    return function () {
      if (pred) {
        return func.apply(this, concat(args, pred, arguments));
      }
    };
  }),

  unary: function (fn) {
    return function () {
      return fn.call(this, arguments[0]);
    };
  },

  or: function () {
    for (var i = 0, l = arguments.length, val; i < l; ++i) {
      if (val = arguments[i]()) {
        return val;
      }
    }
  },

  blank: function (obj) {
    return !obj;
  },

  identity: function (v) {
    return v;
  },

  splitBy: autoCurry(function (coll, predicate) {
    return coll.reduce(function (result, elem) {
      if (predicate(elem)) {
        result.push([]);
        return result;
      }
      if (result.length === 0) {
        result.push([]);
      }
      result[result.length - 1].push(elem);
      return result;
    }, []);
  }),

  indexOf: autoCurry(function (pred, coll) {
    for (var i = 0, l = coll.length; i < l; ++i) {
      if (pred(coll[i])) { return i; }
    }
    return -1;
  }),

  find: autoCurry(function (pred, coll) {
    for (var i = 0, l = coll.length; i < l; ++i) {
      if (pred(coll[i])) { return coll[i]; }
    }
  }),

  not: autoCurry(function (fn, v) {
    return !fn(v);
  }),

  contained: autoCurry(function (vals, val) {
    return vals && vals.indexOf(val) >= 0;
  }),

  eq: autoCurry(function (val1, val2) {
    return val1 === val2;
  }),

  compose: function () {
    var functions = slice(arguments);
    return function (arg) {
      return functions.reduceRight(function (res, fn) {
        return fn.call(this, res);
      }, arg);
    };
  },

  merge: function () {
    var result = {};
    for (var i = 0, l = arguments.length; i < l; ++i) {
      for (var prop in arguments[i]) {
        result[prop] = arguments[i][prop];
      }
    }
    return result;
  },

  takeWhile: autoCurry(function (coll, pred) {
    var result = [];
    for (var i = 0, l = coll.length; i < l; ++i) {
      if (!pred(coll[i])) { return result; }
      result.push(coll[i]);
    }
    return result;
  }),

  dropWhile: autoCurry(function (coll, pred) {
    for (var i = 0, l = coll.length; i < l; ++i) {
      if (pred(coll[i])) {
        return coll.slice(i + 1);
      }
    }
    return [];
  }),

  mapcat: autoCurry(function (fn, coll) {
    return coll.map(fn).reduce(function (a, b) {
      return concat(a, b);
    }, []);
  }),

  promisify: function (fn) {
    return function () {
      var args = slice(arguments);
      var self = this;
      return new Promise(function (resolve, reject) {
        fn.apply(self, args.concat(function (err, result) {
          if (err) { return reject(err); }
          resolve(result);
        }));
      });
    };
  },

  sortBy: autoCurry(function (fn, coll) {
    return coll.sort(function (a, b) {
      var pa = fn(a), pb = fn(b);
      if (pa < pb) { return -1; }
      if (pa > pb) { return 1; }
      return 0;
    });
  }),

  makeList: autoCurry(function (first, rest) {
    return [first].concat(rest);
  }),

  pluck: autoCurry(function (props, obj) {
    return props.reduce(function (res, prop) {
      res[prop] = obj[prop];
      return res;
    }, {});
  })
};
