var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var defaultSquareSize = 48;
var levelSource = null;
var level = new GridLevel(16, 16, defaultSquareSize);
var robotStepTime = 400;
var frameTime = 50;
var starsAttained = 1;

console.log("Initialising!");

// Initialisation

function setLevel(newLevel) {
  if (newLevel instanceof GridLevel) {
    level = newLevel;
  }
}

function GridLevel(width, height, squareSize) {
  this.levelId = null;
  this.nextLevelId = null;
  this.width = width;
  this.height = height;
  this.squareSize = squareSize;
  this.grid = createArray(width, height);
  this.updateState = true;
  this.bolts = 0;
  this.robot = null;
  this.hints = [];
  this.hintCounter = 0;
  this.runtimeMillis = 0;
  this.minActions = 0;
  this.maxActions = 0;

  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      this.grid[i][j] = new GridSquare(i, j);
    }
  }
}

GridLevel.prototype.getSquare = function (x, y) {
  if (x >= this.width || y >= this.height || x < 0 || y < 0) {
    return null;
  }

  return this.grid[x][y];
}

GridLevel.prototype.getDrawingOrdinate = function (ord) {
  return ord * this.squareSize;
}

GridLevel.prototype.setRobot = function (robot) {
  this.robot = robot;
}

GridLevel.prototype.addEntity = function (entity, x, y) {
  var square = this.getSquare(x, y);

  if (square.entity === null) {
    square.entity = entity;
    entity.loc = new Point(x, y);
    entity.added();
    return true;
  }
  return false;
}

GridLevel.prototype.boltAdded = function() {
  this.bolts++;
  //console.log("Bolts: " + this.bolts);
}

GridLevel.prototype.boltCollected = function() {
  this.bolts--;
  //console.log("Bolts: " + this.bolts);
  if (this.bolts == 0) {
    this.levelCompleted();
  }
}

GridLevel.prototype.update = function () {
  this.runtimeMillis += frameTime;

  for (i = 0; i < this.width; i++) {
    for (j = 0; j < this.height; j++) {
      this.grid[i][j].update();
    }
  }

  this.updateState = !this.updateState;
}

GridLevel.prototype.moveEntity = function(entity, point) {
  point = clampToGrid(point);

  if (entity.loc.is(point)) {
    return false;
  }

  if (!this.grid[point.x][point.y].isBlocking()) {
    this.grid[entity.loc.x][entity.loc.y].entityMoved();
    this.grid[point.x][point.y].setEntity(entity);
    entity.loc = new Point(point.x, point.y);
    return true;
  }

  return false;
}

GridLevel.prototype.getTopLeft = function() {
  return new Point((canvas.width - level.width * level.squareSize) / 2,
    (canvas.height - level.height * level.squareSize) / 2);
}

GridLevel.prototype.getBottomRight = function() {
  return new Point(canvas.width - (canvas.width - level.width * level.squareSize) / 2,
    canvas.height - (canvas.height - level.height * level.squareSize) / 2);
}

function isMoveBlock(type) {
  if (type === "move_forward") return true;
  if (type === "rotate_right") return true;
  if (type === "rotate_left") return true;
  return false;
}

function countMoveBlocks() {
  let blocksUsed = 0;
  let blocks = workspace.getAllBlocks();
  for (let i = 0; i < blocks.length; i++) {
    if (isMoveBlock(blocks[i].type)) {
      blocksUsed++;
    }
  }
  return blocksUsed;
}

GridLevel.prototype.levelCompleted = async function() {
  let rob = getRobot();

  if (rob !== null) {
    console.log("Actions Taken: " + rob.actionsTaken);
    let actionDiff = this.maxActions - this.minActions;
    let actionScore = Math.max(actionDiff - (rob.actionsTaken - this.minActions), 0) / actionDiff;
    console.log("Action Score: " + actionScore);

    let blocksUsed = countMoveBlocks();
    console.log("Move Blocks Used: " + blocksUsed);
    let blockDiff = this.maxBlocks - this.minBlocks;
    let blockScore = Math.max(blockDiff - (blocksUsed - this.minBlocks), 0) / blockDiff;
    console.log("Block Score: " + blockScore);

    let score = 0.3 * actionScore + 0.7 * blockScore;
    console.log("Score " + score);
    starsAttained = Math.min(Math.floor(score * 3) + 1, 3);
    if (score >= 1/3 && score < 0.8) {
      starsAttained = 2;
    }

    draw();
    await sleep(robotStepTime);
    clearTimeout(executionTimeoutId);
    let text = "Action Score: " + Math.round(actionScore*100) + "%<br>Block Score: " + Math.round(blockScore * 100) + "%";
    displayAlert("You Won!", "", function() {
      var thisLevel = level.levelId;
      var nextLevel = level.nextLevelId;

      var xml = Blockly.Xml.workspaceToDom(workspace);
      var xml_text = Blockly.Xml.domToText(xml);

      httpPost("https://edubot-learn.herokuapp.com/shared/set_result", {level: level.levelId, solution: xml_text, score: starsAttained}, function(status) {

        // If teacher is logged in
        if (status === 251) {
          return;
        }

        if (!(status === 200 || status === 250 || status === 251)) {
          alert("Unknown error, status: ", status);
        }
        location.href = '/student/level_results?levelId=' + thisLevel + '&nextId=' + nextLevel + '&sts=' + starsAttained;
      });
    });
  }
}

GridLevel.prototype.showHint = function() {
  if (this.hints.length > 0) {
    displayAlert("Hint", this.hints[this.hintCounter]);
    this.hintCounter = (this.hintCounter + 1) % this.hints.length;
  }
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.is = function (point) {
  return this.x === point.x && this.y === point.y;
};

function GridSquare(x, y) {
  this.loc = new Point(x, y);
  this.entity = null;
}

GridSquare.prototype.update = function () {
  ent = this.entity;
  if (ent !== null && ent.needsUpdating(level.updateState)) {
    ent.update();
    ent.updateState = level.updateState;
  }
}

GridSquare.prototype.draw = function () {
  ctx.beginPath();
  ctx.rect(this.loc.x * level.squareSize, this.loc.y * level.squareSize, level.squareSize, level.squareSize);
  ctx.strokeStyle = "#adadb2"
  ctx.stroke();
  ctx.closePath();

  if (this.entity !== null) {
    this.entity.draw(
      level.getDrawingOrdinate(this.loc.x), level.getDrawingOrdinate(this.loc.y));
  }
}

GridSquare.prototype.entityMoved = function () {
  this.entity = null;
}

GridSquare.prototype.setEntity = function (entity) {
  let oldEntity = this.entity;

  this.entity = entity;

  if (oldEntity !== null) {
    oldEntity.removed();
  }
}

GridSquare.prototype.isBlocking = function() {
  return this.entity !== null && this.entity.isBlocking();
}

setInterval(update, frameTime);

function createBoundedLevel(width, height, squareSize) {
  let lev = new GridLevel(width, height, squareSize);

  for (let i = 0; i < lev.width; i++) {
    lev.addEntity(new BasicWall(), i, 0);
    lev.addEntity(new BasicWall(), i, height - 1);
  }

  for (let i = 0; i < lev.height; i++) {
    lev.addEntity(new BasicWall(), 0, i);
    lev.addEntity(new BasicWall(), width - 1, i);
  }

  return lev;
}

function loadLevel(loadEvent) {
	let file = loadEvent.target.files[0];
	let reader = new FileReader();
	let text = null;

	reader.onload = (function(theFile) {
    return function(e) {
			enterLevel(e.target.result);
    };
  })(file);

	reader.readAsText(file);
}

function enterLevel(jsonLevel) {
  let newLevel = parseLevel(jsonLevel);

  if (newLevel !== null) {
    setLevel(newLevel);
    return true;
  }

  return false;
}

function update() {
  //canvas.width = canvas.style.width;
  //canvas.height = canvas.style.height;

  level.update();
  draw();
}

// Repaints the game
function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level.grid.forEach(function (column) {
    column.forEach(function (square) {
      resetCanvasTransforms();
      square.draw();
    });
  });

  resetCanvasTransforms();
}

function drawImage(imageId, x, y, width, height) {
  var image = document.getElementById(imageId);
  ctx.drawImage(image, x, y, width, height);
}

function resetCanvasTransforms() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  let xOffset = (canvas.width - level.width * level.squareSize) / 2;
  let yOffset = (canvas.height - level.height * level.squareSize) / 2;
  ctx.translate(xOffset, yOffset);
}

// Level

function getRobot() {
  return level.robot;
}

function clampToGrid(point) {
  return new Point(clamp(point.x, 0, level.width - 1), clamp(point.y, 0, level.height - 1));
}

// Parse a level from JSON
function parseLevel(level) {
  let reviver = function(key, value) {
    if (key === "") {
      // Reviving the full object.

      //console.log("Restoring level");

      let gridLevel = Object.create(GridLevel.prototype);
      //let gridLevel = new GridLevel(0, 0, 1);

      // Restore level properties.
      for (var vr in value) {
        gridLevel[vr] = value[vr];
      }

      gridLevel.robot = null;

      //console.log("Restored grid level object:");
      //console.log(gridLevel);
      //console.log("\nRestoring grid squares:");

      // Restore grid squares.
      for (let x = 0; x < gridLevel.width; x++) {
        for (let y = 0; y < gridLevel.height; y++) {
          let newSquare = Object.create(GridSquare.prototype);
          let oldSquare = gridLevel.grid[x][y];

          for (var vr in oldSquare) {
            newSquare[vr] = oldSquare[vr];
          }

          gridLevel.grid[x][y] = newSquare;

          // Restore entity.
          if (newSquare.entity != null) {
            let entity = generateEntityFromId(newSquare.entity.entityId);

            for (var vr in newSquare.entity) {
              entity[vr] = newSquare.entity[vr];
            }

            entity.loc = new Point(entity.loc.x, entity.loc.y);

            newSquare.entity = entity;

            if (entity.isRobot()) {
              gridLevel.robot = entity;
            }

            entity.loaded();
          }
        }
      }

      //console.log("\nRestored full level:");
      //console.log(gridLevel);

      gridLevel.runtimeMillis = 0;

      return gridLevel;
    } else {
      return value;
    }
  }

  //console.log("The original level is:");
  //console.log(level);

  let newLevel = JSON.parse(level, reviver);

  if (newLevel !== null && newLevel !== undefined) {
    levelSource = level;
  }

  return newLevel;
}

function generateEntityFromId(entityId) {
  // Only accept a single word id.
  if (/^[a-zA-Z]+$/.test(entityId)) {
    var entity;
    eval("entity = new " + entityId + "();");
    return entity;
  }
}
