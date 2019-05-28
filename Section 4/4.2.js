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
