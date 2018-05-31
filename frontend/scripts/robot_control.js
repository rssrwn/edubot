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

async function executeCommands() {
  //console.log("Executing commands");
  
  runningCommands = true;
  
  while (commands.length > 0) {
    let command = commands.shift();
    await sleep(command.delay);
    command.execute();
    //console.log("Executed a command");
  }
  
  //console.log("Done executing");
  
  commands = [];
  runningCommands = false;
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

MoveCommand.prototype.execute = function() {edubot.moveForward()};
RotateLeftCommand.prototype.execute = function() {edubot.rotateLeft()};
RotateRightCommand.prototype.execute = function() {edubot.rotateRight()};
BlockedByWallCommand.prototype.execute = function () {return edubot.blockedByWall()}

// The robot

function Robot() {
  Entity.call(this);
  this.dir = Dir.RIGHT;
}

Robot.prototype = Object.create(Entity.prototype);

Robot.prototype.update = function() {
  if (Math.random() <= 0.3) {
    if (Math.random() <= 0.5) {
      this.rotateLeft();
    } else {
      this.rotateRight();
    }
  }
  
  this.moveForward();
}

Robot.prototype.draw = function(x, y) {
  let size = level.squareSize * 1.2;
  let xTrans = x + level.squareSize / 2;
  let yTrans = y + level.squareSize / 2;
  ctx.translate(xTrans, yTrans);
  
  let rot = this.dir * 90 * Math.PI / 180;
  
  ctx.rotate(rot);
  drawImage("robot_image", -size / 2, -size / 2, size, size);
  ctx.rotate(-rot);
  ctx.translate(-xTrans, -yTrans);
}

var counter = 0;

Robot.prototype.moveForward = function() {
  let x = counter;
  counter++;
  this.setLocation(DirProperties[this.dir].moveForward(this.loc));
}

Robot.prototype.rotateRight = function() {
  this.dir = DirProperties[this.dir].rotateRight;
}

Robot.prototype.rotateLeft = function() {
  this.dir = DirProperties[this.dir].rotateLeft;
}

// Conditionals

Robot.prototype.blockedByWall = function() {
  let pointInFront = DirProperties[this.dir].moveForward(this.loc);
  let square = level.getSquare(pointInFront.x, pointInFront.y);
  return square !== null && square.isBlocking();
}