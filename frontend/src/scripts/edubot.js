var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var defaultSquareSize = 48;
var level = new GridLevel(16, 16, defaultSquareSize);
var robotStepTime = 400;
var frameTime = 50;

console.log("Initialising!");

// Initialisation

function setLevel(newLevel) {
  if (newLevel instanceof GridLevel) {
    level = newLevel;
  }
}

function GridLevel(width, height, squareSize) {
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
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
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
    this.grid[entity.loc.x][entity.loc.y].setEntity(null);
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

GridLevel.prototype.levelCompleted = function() {
  let score = Math.max(2000 - 40 * getRobot().actionsTaken, 100);
  alert("You won! \nYour score is: " + score);
}

GridLevel.prototype.showHint = function() {
  if (this.hints.length > 0) {
    alert(this.hints[this.hintCounter]);
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
  if (this.entity !== null) {
    this.entity.draw(
      level.getDrawingOrdinate(this.loc.x), level.getDrawingOrdinate(this.loc.y));
  }
  
  ctx.beginPath();
  ctx.rect(this.loc.x * level.squareSize, this.loc.y * level.squareSize, level.squareSize, level.squareSize);
  ctx.strokeStyle = "#adadb2"
  ctx.stroke();
  ctx.closePath();
}

GridSquare.prototype.setEntity = function(entity) {
  if (this.entity !== null) {
    this.entity.removed();
  }
  
  this.entity = entity;
}

GridSquare.prototype.isBlocking = function() {
  return this.entity !== null && this.entity.isBlocking();
}

setInterval(update, frameTime);


function update() {
  //canvas.width = canvas.style.width;
  //canvas.height = canvas.style.height;
  
  //level.update();
  draw();
}

// Repaints the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  level.grid.forEach(function (column) {
    column.forEach(function (square) {
      resetCanvasTransforms();
      square.draw();
    });
  });
  
  resetCanvasTransforms();
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
      
      return gridLevel;
    } else {
      return value;
    }
  }
  
  return JSON.parse(level, reviver);
}

function generateEntityFromId(entityId) {
  // Only accept a single word id.
  if (/^[a-zA-Z]+$/.test(entityId)) {
    var entity;
    eval("entity = new " + entityId + "();");
    return entity;
  }
}

// Drawing

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
