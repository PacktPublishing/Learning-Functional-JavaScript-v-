require('./test-helper');
var parse = require('./parser').parse;

describe('AST parser', function () {

  it('parses plain text', function () {
    var res = parse('You are in a cold and dark place');

    assert.equals(res, [
      ['plainText', 'You are in a cold and dark place']
    ]);
  });

  it('parses multiple plain text nodes', function () {
    var res = parse('You are in a cold and dark place\nIt is cold');

    assert.equals(res, [
      ['plainText', 'You are in a cold and dark place'],
      ['plainText', 'It is cold']
    ]);
  });

  it('parses paragraph markers', function () {
    var res = parse('You are in a cold and dark place\n\nIt is cold');

    assert.equals(res, [
      ['plainText', 'You are in a cold and dark place'],
      ['paragraph'],
      ['plainText', 'It is cold']
    ]);
  });

});
