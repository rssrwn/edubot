const path = require('path');
const fs = require('fs');

exports.getLevel = async function(levelName, callback) {
  var loc = __dirname;
  var level_path = path.join(__dirname, './../public/shared/levels/' + levelName + '/' + levelName + '.lev');
  fs.readFile(level_path, 'utf8', function(err, data) {
    callback(data);
  });
}
