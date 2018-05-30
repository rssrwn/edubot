var Dir = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3,
  
  properties: {
    0: {moveForward: function(point) {return new Point(point.x + 1, point.y)}},
    1: {moveForward: function(point) {return new Point(point.x, point.y + 1)}},
    2: {moveForward: function(point) {return new Point(point.x - 1, point.y)}},
    3: {moveForward: function(point) {return new Point(point.x, point.y - 1)}}
  }
};

Robot.prototype.dir = Dir.RIGHT;

Robot.prototype.moveForward = function() {
  
}