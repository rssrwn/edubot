exports.forFunction = function(from, to, increment, elem) {
  let code = "";
  console.log("Iterating through for loop: from " + from + " to " + to + " with increment " + increment);
  
  let i = from;
  
  for (i = from; i < to; i++) {
    console.log("Running iteration: i = " + i + ", to = " + to + ", inc = " + increment);
    code += elem.fn(i);
    console.log("Completed an iteration: i = " + i + ", to = " + to + ", inc = " + increment);
  }
  
  console.log("Finished for loop: i = " + i + ", to = " + to + ", inc = " + increment);
  
  return code;
}
