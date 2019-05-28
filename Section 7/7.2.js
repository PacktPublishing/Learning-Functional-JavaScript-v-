function curry(fn, args, length) {
  return function (arg) {
    var allArgs = (args || []).concat([].slice.call(arguments, 0, 1));
    length = length || fn.length;
    if (allArgs.length < length) {
      return curry(fn, allArgs);
    }
    return fn.apply(this, allArgs);
  };
}

function autoCurry(fn, length) {
  length = length || fn.length;
  return function () {
    if (arguments.length >= length) {
      return fn.apply(this, arguments);
    } else {
      return curry(fn, [].slice.call(arguments, 0));
    }
  };
}

function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
};

var _nth = autoCurry(function (n, list) {
  return list[n];
});

var first = partial(_nth, 0);
var second = partial(_nth, 1);

var eq = autoCurry(function (val, other) {
  return val === other;
});

function compose() {
  var fns = [].slice.call(arguments).reverse();
  return function () {
    return first(fns.reduce(function (args, fn) {
      return [fn.apply(null, args)];
    }, arguments));
  };
}

function identity(v) { return v; };

function rest(list) {
  return list.slice(1);
}

function makeList(first, rest) {
  return [first].concat(rest);
}

var prop = autoCurry(function (prop, obj) {
  console.log('prop(' + prop + ', ' + JSON.stringify(obj) + ')');
  return obj[prop];
});

function renderBlogPost(post) {
  console.log(post.title);
}

function square(n) {
  return n * n;
}

function nth(n, sequence) {
  if (sequence === null) {
    return null;
  }
  if (n === 0) {
    return sequence.first();
  } else {
    return nth(n - 1, sequence.rest());
  }
}

function isEven(num) {
  console.log('isEven(' + num + ')');
  return num % 2 === 0;
}

function trampoline(fn) {
  while (typeof fn === 'function') {
    fn = fn();
  }

  return fn;
}

var func = autoCurry(function (prop, obj) {
  return obj ? obj[prop]() : null;
});

function lazy(source, first, rest) {
  if (source === null) {
    return null;
  }

  var head, tail;
  return {
    first: function () {
      if (!head) {
        head = first(source);
      }
      return head;
    },

    rest: function () {
      if (!tail) {
        tail = partial(lazy, rest(source), first, rest);
      }
      return trampoline(tail);
    }
  };
}

function nullifyEmpty(list) {
  return list.length === 0 ? null : list;
}

function sequence(list) {
  return lazy(list, first, compose(nullifyEmpty, rest));
}

function map(fn, seq) {
  return lazy(seq, compose(fn, func('first')), func('rest'));
}

function filter(pred, seq) {
  function findFirst(seq) {
    while (seq) {
      if (pred(seq.first())) {
        return seq;
      }
      seq = seq.rest();
    }
  }

  return lazy(
    seq,
    compose(func('first'), findFirst),
    compose(func('rest'), findFirst)
  );
}

function realize(seq) {
  var arr = [];
  while (seq) {
    if (seq.first()) {
      arr.push(seq.first());
    }
    seq = seq.rest();
  }
  return arr;
}

var list = sequence([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}]);
var res = map(prop('id'), list);
console.log(realize(filter(isEven, res)));
