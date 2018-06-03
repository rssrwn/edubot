var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var level;
var edubot = new Robot();
var robotStepTime = 400;

console.log("Initialising!");

// Initialisation

function GridLevel(width, height, squareSize) {
  this.width = width;
  this.height = height;
  this.squareSize = squareSize;
  this.grid = createArray(width, height);
  this.updateState = true;
  
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      this.grid[i][j] = new GridSquare(i, j);
    }
  }
}

GridLevel.prototype.getSquare = function(x, y) {
  if (x >= this.width || y >= this.height) {
    return null;
  }
  
  return this.grid[x][y];
}

GridLevel.prototype.getDrawingOrdinate = function(ord) {
  return ord * this.squareSize;
}

GridLevel.prototype.addEntity = function(entity, x, y) {
  let square = this.getSquare(x, y);
  
  if (square.entity === null) {
    square.entity = entity;
    entity.loc = new Point(x, y);
    return true;
  }
  return false;
}

GridLevel.prototype.update = function() {
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
  this.entity = entity;
}

GridSquare.prototype.isBlocking = function() {
  return this.entity !== null && this.entity.isBlocking();
}

setInterval(update, 100);
initLevel();

function initLevel() {
  let testLevel = new GridLevel(24, 24, 32);
  testLevel.addEntity(new BasicFood(), 0, 0);
  testLevel.addEntity(edubot, 15, 15);
  
  for (i = 0; i < 20; i++) {
    testLevel.addEntity(new BasicFood(), randomInt(testLevel.width), randomInt(testLevel.height));
  }
  for (i = 0; i < 20; i++) {
    testLevel.addEntity(new BasicWall(), randomInt(testLevel.width), randomInt(testLevel.height));
  }
  level = testLevel;
  //level = JSON.parse(JSON.stringify(testLevel));
}

function update() {
  //canvas.width = canvas.style.width;
  //canvas.height = canvas.style.height;
  
  //level.update();
  draw();
}

// Repaints the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let offset = (canvas.width - level.width * level.squareSize) / 2;
  ctx.translate(offset, offset);
  
  level.grid.forEach(function (column) {
    column.forEach(function (square) {
      //console.log("Square is: ");
      //console.log(JSON.stringify(square));
      square.draw();
    });
  });
  
  resetCanvasTransforms();
}


// Entities

function clampToGrid(point) {
  return new Point(clamp(point.x, 0, level.width - 1), clamp(point.y, 0, level.height - 1));
}


// Drawing

function drawImage(imageId, x, y, width, height) {
  var image = document.getElementById(imageId);
  ctx.drawImage(image, x, y, width, height);
}

function resetCanvasTransforms() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}