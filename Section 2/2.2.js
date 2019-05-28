function contains(list, item) {
  return list.indexOf(item) >= 0;
}

function nodesByTypes(types, ast) {
  return ast.filter(function (node) {
    return contains(types, node[0]);
  });
}

function second(list) {
  return list[1];
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

var ast = [
  ['plainText', 'You are in a'],
  ['plainText', 'cold and dark place'],
  ['paragraph'],
  ['paragraph'],
  ['plainText', 'You are cold']
];

console.log(prepareView({ast: ast}));
