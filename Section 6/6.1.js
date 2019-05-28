function first(list) {
  return list[0];
}

function rest(list) {
  return list.slice(1);
}

function sum(numbers) {
  if (numbers.length === 0) {
    return 0;
  } else {
    return first(numbers) + sum(rest(numbers));
  }
}

function join(separator, list) {
  if (list.length === 0) {
    return '';
  } else if (list.length === 1) {
    return first(list);
  } else {
    return first(list) + separator + join(separator, rest(list));
  }
}

function makeList(first, rest) {
  return [first].concat(rest);
}

function getEmails(users) {
  if (users.length === 0) {
    return [];
  } else {
    return makeList(first(users).email, rest(users));
  }
}
