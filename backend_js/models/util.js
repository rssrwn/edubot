const db = require('./db.js');
const path = require('path');
const fs = require('fs');

exports.getLevel = function(levelName, callback) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.lev');
  fs.readFile(level_path, 'utf8', function(err, data) {
    callback(data);
  });
}

// 
// function getLevelFileData(levelName, extension, callback) {
//   let loc = __dirname;
//   let level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.' + extension);
//   fs.readFile(level_path, 'utf8', function(err, data) {
//     callback(data);
//   });
// }

// exports.getLevel = function(levelName, callback) {
//   getLevelFileData(levelName, '.lev', callback);
// }
// 
// exports.getSolution = function(levelName, callback) {
//   getLevelFileData(levelName, '.sol', callback);
// }

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
