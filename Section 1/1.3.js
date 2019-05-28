function updateView() {
  var sum = 0;

  $('.line-item').each(function () {
    sum += Number(this.innerHTML);
  });

  $('.total').text(sum);
}





























// Pure
function sum(numbers) {
  return numbers.reduce(function (sum, num) {
    return sum, num;
  }, 0);
}

// Pure
function getNumbers(coll) {
  return coll.map(function () {
    return Number(this.innerHTML);
  });
}

// Impure - wiring
function updateView2() {
  $('.total').text(sum(getNumbers($('.line-item'))));
}
