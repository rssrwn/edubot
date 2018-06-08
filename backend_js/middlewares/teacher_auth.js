const db = require('../models/db.js');

module.exports = async function(req, res, next) {
  console.log("teacher cookies auth", req.cookies);
  uname = req.cookies['edubot-cookie'];
  let type = await db.getUserType(uname);

  console.log('type', type);

  if (type === db.userTypeEnum.TEACHER) {
    next();
  } else {
    console.log(uname, " was denied teacher access");
    res.status(401).send("You do not have permission to access this page");
  }
}
