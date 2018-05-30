var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var level = new GridLevel(20, 20, 30);
var edubot = new Robot();

console.log("Initialising!");

// Initialisation

initLevel();
setInterval(update, 100);

function initLevel() {
  level.addEntity(new RedRectangle(), 0, 0);
  level.addEntity(edubot, 15, 15);
  
  for (i = 0; i < 5; i++) {
    level.addEntity(new RedRectangle(), randomInt(20), randomInt(20));
  }
}

function update() {
  //canvas.width = canvas.style.width;
  //canvas.height = canvas.style.height;
  
  level.update();
  draw();
}

// Repaints the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  level.grid.forEach(function (column) {
    column.forEach(function (square) {
      square.draw();
    });
  });
}


// Entities

function GridLevel(width, height, squareSize) {
  this.width = width;
  this.height = height;
  this.squareSize = squareSize;
  this.grid = createArray(width, height);
  
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      this.grid[i][j] = new GridSquare(i, j);
    }
  }
  
  this.getSquare = function (x, y) {
    return this.grid[x][y];
  }
  
  this.getDrawingOrdinate = function (ord) {
    return ord * squareSize;
  }
  
  this.addEntity = function (entity, x, y) {
    var square = this.getSquare(x, y);
    
    if (square.entity === null) {
      square.entity = entity;
      entity.loc = new Point(x, y);
      return true;
    }
    return false;
  }
  
  this.update = function () {
    for (i = 0; i < width; i++) {
      for (j = 0; j < height; j++) {
        this.grid[i][j].update();
      }
    }
  }
}

GridLevel.prototype.moveEntity = function(entity, point) {
  point = clampToGrid(point);
  this.grid[entity.loc.x][entity.loc.y].setEntity(null);
  console.log("New point: " + JSON.stringify(point));
  this.grid[point.x][point.y].setEntity(entity);
  entity.loc = new Point(point.x, point.y);
}

function clampToGrid(point) {
  return new Point(clamp(point.x, 0, level.width - 1), clamp(point.y, 0, level.height - 1));
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function GridSquare(x, y) {
  this.loc = new Point(x, y);
  this.entity = null;
  
  this.update = function () {
    if (this.entity !== null) {
      this.entity.update();
    }
  }
  
  this.draw = function () {
    if (this.entity !== null) {
      this.entity.draw(
        level.getDrawingOrdinate(this.loc.x), level.getDrawingOrdinate(this.loc.y));
    } else {
      ctx.beginPath();
      ctx.rect(this.loc.x * level.squareSize, this.loc.y * level.squareSize, level.squareSize, level.squareSize);
      ctx.strokeStyle = "#000000"
      ctx.stroke();
      ctx.closePath();
    }
  }
  
  this.setEntity = function(entity) {
    this.entity = entity;
  }
}

// Drawing

function drawImage(imageId, x, y, width, height) {
  var image = document.getElementById(imageId);
  ctx.drawImage(image, x, y, width, height);
}

function resetCanvasTransforms() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}