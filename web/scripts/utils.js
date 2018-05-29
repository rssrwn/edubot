// Utils

function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }

  return arr;
}

// Generates a random whole number between 0 (inclusive) and max (exclusive).
function randomInt(max) {
  return Math.floor(Math.random() * max);
}