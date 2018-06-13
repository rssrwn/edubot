const db = require('./db.js');
const path = require('path');
const fs = require('fs');
const njsUtil = require('util');

const readFile = njsUtil.promisify(fs.readFile);

exports.getConceptData = async function(conceptName, extension) {
  var loc = __dirname;
  var concept_path = path.join(__dirname, './../public/shared/concepts/' + conceptName + '/' + conceptName + '.' + extension);
  return await readFile(concept_path, 'utf8');
}

exports.getLevelData = async function(levelName, extension) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.' + extension);
  return await readFile(level_path, 'utf8');
  /*fs.readFile(level_path, 'utf8', function(err, data) {
    callback(data);
  });*/
}

exports.isStudent = async function(uname) {
  var type = db.userTypeEnum.NEITHER;
  try {
    type = await db.getUserType(uname);
  } catch(e) {
    next(e);
  };
  let student = false;
  if (type === db.userTypeEnum.STUDENT) {
    student = true;
  }
  return student;
}

exports.hasFeedback = async function(uname, level) {
  let level_id = db.getLevelId(level);
  let feedback = db.getAllFeedback(uname);
  let res = false;

  for (var i=0; i<feedback.length; i++) {
    let level = feedback[i];
    if (level.level_id === level_id) {
      res = true;
    }
  }
  return res;
}
