function nth(n, list) {
  return list[n];
}

function partial(fn) {
  var args = [].slice.call(arguments, 1);

  return function () {
    var allArgs = args.concat([].slice.call(arguments));
    return fn.apply(null, allArgs);
  };
}

var second = partial(nth, 1);

function addedFlags(ast) {
  return nodesByTypes(['add-flag'], ast).map(second);
}

function contains(list, item) {
  return list.indexOf(item) >= 0;
}

function nodesByTypes(types, ast) {
  return ast.filter(function (node) {
    return contains(types, node[0]);
  });
}

function addedFlags(ast) {
  return nodesByTypes(['add-flags'], ast).map(second);
}

function splitBy(predicate, list) {
  var result = [];

  list.forEach(function (elem) {
    if (predicate(elem)) {
      result.push([]);
      return result;
    } else if (result.length === 0) {
      result.push([]);
    }

    result[result.length - 1].push(elem);
  });

  return result;
}

function isParagraph(node) {
  return node[0] === 'paragraph';
}

function makeParagraph(entries) {
  return entries.map(second).join('\n');
}

function prepareView(page) {
  return splitBy(
    isParagraph,
    nodesByTypes(['plainText', 'paragraph'], page.ast)
  ).map(makeParagraph);
}

console.log(prepareView({
  id: 0,
  ast: [
    ['add-flag', 'STARTED_2'],
    ['paragraph'],
    ['plainText', 'You are in a vast desert.'],
    ['paragraph'],
    ['paragraph'],
    ['alternative', 1, 'Head north'],
    ['alternative', 2, 'Head south'],
    ['alternative', 0, 'Hang around']
  ]
}));
