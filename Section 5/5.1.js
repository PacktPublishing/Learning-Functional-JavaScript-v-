function list(items) {
  var data = items.slice();

  return {
    get: function (i) {
      return data[i];
    },

    push: function (item) {
      return list(data.concat(item));
    },

    set: function (i, item) {
      if (data[i] === item) {
        return this;
      }

      var copy = data.slice();
      copy[i] = item;
      return list(copy);
    },

    toArray: function () {
      return data.slice();
    }
  };
}

var nums = list([0, 1, 2]);
var moreNums = nums.push(3);
var evenMore = moreNums.set(0, 0);

console.log('nums', nums.toArray());
console.log('moreNums', moreNums.toArray());
console.log('evenMore', evenMore.toArray());
console.log(moreNums === evenMore);
