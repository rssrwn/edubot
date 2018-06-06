module.exports = function(req, res, next) {
  // console.log("teacher cookies auth", req.cookies);
  value = req.cookies['edubot-cookie'];
  if (value === 'teacher') {
    next()
  } else {
    res.status(401).send("Access denied");
  }
}
