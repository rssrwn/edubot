module.exports = function(req, res, next) {
  value = req.cookies['edubot-cookie'];
  if (value === 'student') {
    next()
  } else {
    res.status(401).send("Access denied");
  }
}
