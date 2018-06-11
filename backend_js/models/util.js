const db = require('./db.js');
const path = require('path');
const fs = require('fs');
const njsUtil = require('util');

const readFile = njsUtil.promisify(fs.readFile);

exports.getLevelData = async function(levelName, extension, callback) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.' + extension);
  //return await readFile(level_path, 'utf8')).then(data => {callback(data);};
  fs.readFile(level_path, 'utf8', function(err, data) {
    callback(data);
  });
}

exports.isStudent = async function(uname) {
  var type = db.userTypeEnum.NEITHER;
  try {
    type = await db.getUserType(uname);
  } catch(e) {
    next(e);
  };
  student = false;
  if (type === db.userTypeEnum.STUDENT) {
    student = true;
  }
  return student;
}
