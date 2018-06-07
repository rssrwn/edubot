exports.forFunction = function(from, to, increment, elem) {
  let code = "";
  for (let i = from; i < to; i += increment) {
    code += elem.fn(i);
  }
  return code;
}
