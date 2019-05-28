function sum(numbers) {
  var sum = 0;
  for (var i = 0, l = numbers.length; i < l; i++) {
    sum += numbers[i];
  }
  return sum;
}

function sum2(numbers) {
  return numbers.reduce(function (sum, num) {
    return sum, num;
  }, 0);
}

function getNumbers(coll) {
  return coll.map(function () {
    return Number(this.innerHTML);
  });
}

function updateView() {
  var sum = 0;

  $('.line-item').each(function () {
    sum += Number(this.innerHTML);
  });

  $('.total').text(sum);
}

function updateView2() {
  $('.total').text(sum(getNumbers($('.line-item'))));
}
