var fn = require('../fn');
var slice = fn.slice;
var or = fn.or;
var when = fn.when;
var blank = fn.blank;
var indexOf = fn.indexOf;
var partial = fn.partial;
var first = fn.first;
var rest = fn.rest;
var compose = fn.compose;
var not = fn.not;
var eq = fn.eq;
var makeList = fn.makeList;
var identity = fn.identity;
var func = fn.func;
var takeWhile = fn.takeWhile;
var dropWhile = fn.dropWhile;
var prop = fn.prop;

var isPageEnd = compose(eq(0), prop('length'));
var isParagraph = compose(eq(''), first);
var paragraph = compose(makeList(['paragraph']), parseLines, rest);
var isPlainText = compose(not(eq('=')), first);

function plainText(lines) {
  return makeList(['plainText', lines[0]], parseLines(rest(lines)));
}

var condRe = /\?\s*(!?[_a-zA-Z0-9]+\s*(?:,\s*!?[_a-zA-Z0-9]+)?)\s*\{/;
var closingCondRe = /(^|[^\\])(})/;
var isCond = compose(condRe.test.bind(condRe), first);

function isolateBracket(lines) {
  var idx = indexOf(function (line) {
    return line.split(closingCondRe).length > 1;
  }, lines);
  var split = lines[idx].split(closingCondRe);
  return lines.slice(0, idx).
    concat([split[0] + split[1], split[2], split[3]].filter(identity)).
    concat(lines.slice(idx + 1));
}

var condEndRe = /^}$/;
var isCondEnd = condEndRe.test.bind(condEndRe);

function cond(lines, parseContent) {
  var pieces = first(lines).split(condRe);
  var condLine = pieces[2] ? [pieces[2]] : [];
  var rest = isolateBracket(condLine.concat(lines.slice(1))).map(func('trim'));

  return makeList([
    'cond',
    pieces[1].split(',').map(func('trim')),
    parseContent(takeWhile(rest, not(isCondEnd)))
  ], parseContent(dropWhile(rest, isCondEnd)));
}

var isAlternatives = compose(eq('='), first);
var altRe = /^@(\d+)$/;
var findAlternativeDestination = indexOf(altRe.test.bind(altRe));

function isAlternative(lines) {
  if (!first(lines)) { return false; }
  return findAlternativeDestination(lines) >= 0;
}

function buildAlternative(lines) {
  var altDest = findAlternativeDestination(lines);
  return makeList([
    'alternative',
    Number(lines[altDest].match(altRe)[1]),
    lines.slice(0, altDest).join('\n')
  ], parseAlternatives(lines.slice(altDest + 1)));
}

function parseAlternatives(lines) {
  if (isPageEnd(lines)) {
    return [];
  }
  return or(
    when(blank(first(lines)), partial(parseAlternatives, rest(lines))),
    when(isCond(lines), partial(cond, lines, parseAlternatives)),
    when(isAlternative(lines), partial(buildAlternative, lines))
  );
}

var addFlagRe = /^\+ ?/;
var isAddFlag = compose(addFlagRe.test.bind(addFlagRe), first);

function addFlag(lines) {
  return makeList([
    'add-flag',
    first(lines).trim().replace(addFlagRe, '')
  ], parseLines(lines.slice(1)));
}

var removeFlagRe = /^\- ?/;
var isRemoveFlag = compose(removeFlagRe.test.bind(removeFlagRe), first);

function removeFlag(lines) {
  return makeList([
    'remove-flag',
    lines[0].trim().replace(removeFlagRe, '')
  ], parseLines(lines.slice(1)));
}

function parseLines(lines) {
  return (isPageEnd(lines) && []) ||
    (isCond(lines) && cond(lines, parseLines)) ||
    (isAddFlag(lines) && addFlag(lines)) ||
    (isRemoveFlag(lines) && removeFlag(lines)) ||
    (isParagraph(lines) && paragraph(lines)) ||
    (isPlainText(lines) && plainText(lines)) ||
    (isAlternatives(lines) && parseAlternatives(lines.slice(1)));
}

exports.parse = function (text) {
  return parseLines(text.split('\n').map(func('trim')));
};
