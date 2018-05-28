var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var level = new GridLevel(20, 20, 30);
var robot = new Entity((x, y) => drawImage("robot_image", 30, 30, x, y));

console.log("Initialising!");

// Initialisation

initLevel();
setInterval(update, 100);

function initLevel() {
  level.addEntity(new Entity(drawRect), 0, 0);
  level.addEntity(robot, 15, 15);
  //level.addEntity(new Entity(drawRect), 29, 29);
  
  for (i = 0; i < 5; i++) {
    level.addEntity(new Entity(drawRect), randomInt(20), randomInt(20));
  }
}

function update() {
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

function GridSquare(x, y) {
  this.x = x;
  this.y = y;
  this.entity = null;
  
  this.update = function () {
    if (this.entity !== null) {
      this.entity.update();
    }
  }
  
  this.draw = function () {
    if (this.entity !== null) {
      this.entity.draw(level.getDrawingOrdinate(x), level.getDrawingOrdinate(y));
    }
  }
}

function Entity(draw) {
  this.x = null;
  this.y = null;
  this.draw = draw;
  
  this.update = function () {
    
  };
}

// Drawing

function drawRect(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, 30, 30);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function drawImage(imageId, width, height, x, y) {
  var image = document.getElementById(imageId);
  ctx.drawImage(image, x, y, width, height);
}