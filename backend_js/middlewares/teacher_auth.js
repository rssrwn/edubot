const db = require('../models/db.js');

module.exports = function(req, res, next) {
  // console.log("teacher cookies auth", req.cookies);
  uname = req.cookies['edubot-cookie'];
  type = db.getUserType(uname);

  if (type === db.userTypeEnum.TEACHER) {
    next();
  } else {
    console.log(uname, " was denied teacher access");
    res.status(401).send("You do not have permission to access this page");
  }
}
