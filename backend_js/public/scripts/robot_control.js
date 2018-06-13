var Dir = {
  RIGHT: 0,
  DOWN: 1,
  LEFT: 2,
  UP: 3
};

var DirProperties = {
  0: {moveForward: function(point) {return new Point(point.x + 1, point.y)},
              rotateRight: Dir.DOWN, rotateLeft: Dir.UP},
  1: {moveForward: function(point) {return new Point(point.x, point.y + 1)},
             rotateRight: Dir.LEFT, rotateLeft: Dir.RIGHT},
  2: {moveForward: function(point) {return new Point(point.x - 1, point.y)},
             rotateRight: Dir.UP, rotateLeft: Dir.DOWN},
  3: {moveForward: function(point) {return new Point(point.x, point.y - 1)},
           rotateRight: Dir.RIGHT, rotateLeft: Dir.LEFT}
};

// Commands

var commands = [];
var runningCommands = false;

function addCommand(command) {
  console.log("Adding " + JSON.stringify(command) + " command");
  commands.push(command);
}

function Command(delay) {
  this.delay = delay;
}

Command.prototype.execute = function() {}

function MoveCommand() {
  Command.call(this, robotStepTime);
}

function RotateLeftCommand() {
  Command.call(this, robotStepTime);
}

function RotateRightCommand() {
  Command.call(this, robotStepTime);
}

function BlockedByWallCommand() {
  Command.call(this, robotStepTime);
}

MoveCommand.prototype = Object.create(Command.prototype);
RotateLeftCommand.prototype = Object.create(Command.prototype);
RotateRightCommand.prototype = Object.create(Command.prototype);
BlockedByWallCommand.prototype = Object.create(Command.prototype);

MoveCommand.prototype.execute = function() {getRobot().moveForward()};
RotateLeftCommand.prototype.execute = function() {getRobot().rotateLeft()};
RotateRightCommand.prototype.execute = function() {getRobot().rotateRight()};
BlockedByWallCommand.prototype.execute = function () {return getRobot().blockedByWall()}

// The robot

function Robot() {
  Entity.call(this, true, "Robot");
  this.dir = Dir.RIGHT;
  this.actionsTaken = 0;
  this.anims = new RobotAnims();
}

Robot.prototype = Object.create(Entity.prototype);

Robot.prototype.isRobot = function () {return true}

Robot.prototype.update = function() {
  /*if (Math.random() <= 0.3) {
    if (Math.random() <= 0.5) {
      this.rotateLeft();
    } else {
      this.rotateRight();
    }
  }
  
  this.moveForward();*/
}

Robot.prototype.draw = function(x, y) {
  let size = level.squareSize * 1.2;
  let progress = this.actionProgress();
  
  let prevX = this.prevLoc.x * level.squareSize;
  let prevY = this.prevLoc.y * level.squareSize;
  let curX = (x - prevX) * progress + prevX;
  let curY = (y - prevY) * progress + prevY;
  
  let xTrans = curX + level.squareSize / 2;
  let yTrans = curY + level.squareSize / 2;
  ctx.translate(xTrans, yTrans);
  
  let rot = this.dir * 90 * Math.PI / 180;
  
  let prevRot = this.curDir * 90 * Math.PI / 180;
  
  let curRot = rot - (1 - progress) * prevRot;
  
  ctx.rotate(curRot);
  //drawImage("robot_image", -size / 2, -size / 2, size, size);
  this.anims.draw(0, 0);
}

Robot.prototype.added = function () {
  //console.log("Robot added");
  let existingRobot = level.robot;
  
  if (existingRobot !== null && existingRobot !== this) {
    level.getSquare(existingRobot.loc.x, existingRobot.loc.y).setEntity(null);
  }
  
  level.robot = this;
  this.prevLoc = new Point(this.loc.x, this.loc.y);
  this.curDir = 0;
}

Robot.prototype.removed = function () {
  //console.log("Robot removed!");
  //console.trace();
  if (level.robot === this) {
    level.robot = null;
  }
}

Robot.prototype.loaded = function () {
  this.anims = new RobotAnims();
  this.prevLoc = new Point(this.loc.x, this.loc.y);
  this.curDir = 0;
}

// Robot actions

function progressConvert(x) {
  //(1 / (1 + e^-(10(x - 0.5))) 
  return 1 / (1 + Math.exp(-10 * (x - 0.5)));
}

Robot.prototype.actionProgress = function() {
  if (this.actionStart === undefined) {
    return 0;
  }
  let progress = (new Date().getTime() - this.actionStart) / robotStepTime;
  
  let pause = 0.15;
  
  if (progress > (1 - pause)) {
    progress = 1;
  } else if (progress < pause) {
    progress = 0;
  } else {
    progress = (progress - pause) * 2;
    progress = progressConvert(progress);
  }
  return progress;
}

Robot.prototype.startAction = function() {
  this.actionStart = new Date().getTime();
  this.prevLoc = new Point(this.loc.x, this.loc.y);
  this.curDir = 0;
}

Robot.prototype.moveForward = function() {
  this.actionsTaken++;
  this.startAction();
  this.setLocation(DirProperties[this.dir].moveForward(this.loc));
}

Robot.prototype.rotateRight = function() {
  this.actionsTaken++;
  this.startAction();
  this.dir = DirProperties[this.dir].rotateRight;
  this.curDir = 1;
}

Robot.prototype.rotateLeft = function() {
  this.actionsTaken++;
  this.startAction();
  this.dir = DirProperties[this.dir].rotateLeft;
  this.curDir = -1;
}

// Conditionals

Robot.prototype.blockedByWall = function() {
  let pointInFront = DirProperties[this.dir].moveForward(this.loc);
  let square = level.getSquare(pointInFront.x, pointInFront.y);
  return square !== null && square.isBlocking();
}