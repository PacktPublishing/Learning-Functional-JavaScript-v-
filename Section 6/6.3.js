function sum(numbers, memo) {
  memo = memo || 0;

  if (numbers.length === 0) {
    return memo;
  } else {
    return partial(sum, rest(numbers), memo + first(numbers));
  }
}

function trampoline(fn) {
  while (typeof fn === 'function') {
    fn = fn();
  }

  return fn;
}

function first(list) {
  return list[0];
}

function rest(list) {
  return list.slice(1);
}

function partial(fn) {
  var args = [].slice.call(arguments, 1);
  return function () {
    var allArgs = args.concat([].slice.call(arguments));
    return fn.apply(this, allArgs);
  };
}
