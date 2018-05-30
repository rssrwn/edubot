var List = require("collections/list");

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

var commands = new List();

function addCommand(command) {
  commands.push(command);
}

async function executeCommands() {
  while (commands.length > 0) {
    let command = commands.pop();
    
    command.execute();
    await sleep(command.delay);
  }
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

MoveCommand.prototype = Object.create(Command.prototype);
RotateLeftCommand.prototype = Object.create(Command.prototype);
RotateRightCommand.prototype = Object.create(Command.prototype);

MoveCommmand.prototype.execute = function() {edubot.moveForward};
RotateLeftCommand.prototype = function() {edubot.rotateLeft};
RotateRightCommand.prototype = function () {edubot.rotateRight};

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

Robot.prototype.draw = function draw(x, y) {
  size = level.squareSize;
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(this.dir * 90 * Math.PI / 180)
  drawImage("robot_image", -size / 2, -size / 2, size, size);
  resetCanvasTransforms();
}

var counter = 0;

Robot.prototype.moveForward = async function() {
  let x = counter;
  counter++;
  console.log("Starting sleep: " + x);
  await sleep(robotStepTime);
  console.log("Ending sleep: " + x);
  this.setLocation(DirProperties[this.dir].moveForward(this.loc));
}

Robot.prototype.rotateRight = async function() {
  await sleep(robotStepTime);
  this.dir = DirProperties[this.dir].rotateRight;
}

Robot.prototype.rotateLeft = async function() {
  await sleep(robotStepTime);
  this.dir = DirProperties[this.dir].rotateLeft;
}