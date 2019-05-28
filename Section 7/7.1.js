var blogPosts = [
  {author: {email: 'christian@cjohansen.no'}, title: 'Thinking outside the DOM'},
  {author: {email: 'magnar@kodemaker.no'}, title: 'Introducing Stasis'},
  {author: {email: 'christian@cjohansen.no'}, title: 'Working with React'},
  {author: {email: 'christian@cjohansen.no'}, title: 'Functional programming'}
];

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
  return obj[prop];
});

function renderBlogPost(post) {
  console.log(post.title);
}

function square(n) {
  console.log('Squaring', n);
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

function sequence(list) {
  return {
    first: partial(first, list),
    rest: compose(sequence, partial(rest, list))
  };
}

function map(fn, seq) {
  function lazy(sequence) {
    if (sequence === null) {
      return null;
    }

    return {
      first: function () {
        return fn(sequence.first());
      },

      rest: function () {
        return lazy(sequence.rest());
      }
    };
  }
  
  return lazy(seq);
}

function filter(pred, seq) {
  function lazy(sequence) {
    return {
      first: function () {
        var seq = sequence;
        while (seq) {
          if (pred(seq.first())) {
            return seq.first();
          }
          seq = seq.rest();
        }
      },

      rest: function () {
        var seq = sequence;
        while (seq) {
          if (pred(seq.first())) {
            return seq.rest();
          }
          seq = seq.rest();
        }
      }
    };
  }

  return lazy(seq);
}

function isEven(num) {
  return num % 2 === 0;
}

var list = sequence([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}]);
var mapped = map(function (i) {
  console.log('Mapping', i);
  return i.id;
}, list);
var res = filter(isEven, mapped);

console.log(nth(1, res));
console.log(nth(4, res));
