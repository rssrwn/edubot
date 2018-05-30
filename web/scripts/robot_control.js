var Dir = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
  
  properties: {
    0: {moveForward: function(point) {return new Point(point.x + 1, point.y)},
        rotateRight: DOWN, rotateLeft: UP},
    1: {moveForward: function(point) {return new Point(point.x, point.y + 1)},
        rotateRight: LEFT, rotateLeft: RIGHT},
    2: {moveForward: function(point) {return new Point(point.x - 1, point.y)},
        rotateRight: UP, rotateLeft: DOWN},
    3: {moveForward: function(point) {return new Point(point.x, point.y - 1)},
        rotateRight: RIGHT, rotateLeft: LEFT}
  };
};

Robot.prototype.dir = Dir.RIGHT;

Robot.prototype.moveForward = function() {
  this.loc = Dir.properties[this.dir].moveForward(this.loc);
}

Robot.prototype.rotateRight = function() {
  this.dir = Dir.properties[this.dir].rotateRight;
}

Robot.prototype.rotateLeft = function() {
  this.dir = Dir.properties[this.dir].rotateLeft;
}