const db = require('../models/db.js');

module.exports = async function(req, res, next) {
  console.log("shared cookies auth", req.cookies);
  uname = req.cookies['edubot-cookie'];
  console.log('uname: ', uname);
  let type = await db.getUserType(uname);

  if (type === db.userTypeEnum.STUDENT || type === db.userTypeEnum.TEACHER) {
    next();
  } else {
    console.log(uname, " was denied shared access");
    res.status(401).send("You do not have permission to access this page");
  }
}
