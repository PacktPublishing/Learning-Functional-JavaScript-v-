var fn = require('../fn');
var nodesByTypes = require('./ast-walker').nodesByTypes;
var second = fn.second;
var splitBy = fn.splitBy;
var identity = fn.identity;
var third = fn.third;

function isParagraph(entry) {
  return entry[0] === 'paragraph';
}

function isPlainText(entry) {
  return entry[0] === 'plainText';
}

function makeParagraph(entries) {
  return entries.map(second).join('\n');
}

exports.prepare = function (page) {
  return {
    paragraphs: splitBy(
      nodesByTypes(['plainText', 'paragraph'], page.ast),
      isParagraph
    ).map(makeParagraph).filter(identity),
    alternatives: nodesByTypes(['alternative'], page.ast).map(third)
  };
};
