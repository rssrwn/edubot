module.exports = function(req, res, next) {
  // console.log("student cookies auth", req.cookies);
  value = req.cookies['edubot-cookie'];
  if (value === 'student') {
    next()
  } else {
    res.status(401).send("Access denied");
  }
}
