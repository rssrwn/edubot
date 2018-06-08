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

exports.getSolution = function(levelName, callback) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.sol');
  fs.readFile(level_path, 'utf8', function(err, data) {
    callback(data);
  });
}

exports.getBlocks = function(levelName, callback) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.blocks');
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
