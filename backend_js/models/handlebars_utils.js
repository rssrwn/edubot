exports.forFunction = function(from, to, increment, elem) {
  let code = "";
  console.log("Iterating through for loop: from " + from + " to " + to + " with increment " + increment);
  for (let i = from; i < to; i += increment) {
    console.log("Running iteration: i = " + i + ", to = " + to + ", inc = " + increment);
    code += elem.fn(i);
  }
  return code;
}
