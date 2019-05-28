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

var isParagraph = eq('');

function paragraph(lines) {
  return makeList(['paragraph'], parseLines(rest(lines)))
}

function plainText(lines) {
  return makeList(['plainText', first(lines)], parseLines(rest(lines)));
}

function isPlainText(text) {
  return text && text !== '=';
}

var isEmpty = compose(eq(0), prop('length'));
var isAlternative = eq('=');

function parseAlternatives(lines) {
  // TODO
}

function parseLines(lines) {
  if (isEmpty(lines)) {
    return [];
  }

  if (isAlternative(first(lines))) {
    return parseAlternatives(lines);
  }

  if (isParagraph(first(lines))) {
    return paragraph(lines);
  }

  if (isPlainText(first(lines))) {
    return plainText(lines);
  }
}

var func = autoCurry(function (fn, obj) {
  return obj[fn]();
});

function parse(page) {
  return parseLines(page.split('\n').map(func('trim')));
}

exports.parse = parse;
