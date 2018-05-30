var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");
var level = new GridLevel(20, 20, 30);
var edubot = new Robot();

console.log("Initialising!");

// Initialisation

initLevel();
setInterval(update, 100);

function initLevel() {
  level.addEntity(new Entity(new RedRectangle()), 0, 0);
  level.addEntity(new Entity(edubot), 15, 15);
  //level.addEntity(new Entity(drawRect), 29, 29);
  
  for (i = 0; i < 5; i++) {
    level.addEntity(new Entity(new RedRectangle()), randomInt(20), randomInt(20));
  }
}

function update() {
  //canvas.width = canvas.style.width;
  //canvas.height = canvas.style.height;
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
      this.entity.draw(level.getDrawingOrdinate(loc.x), level.getDrawingOrdinate(loc.y));
    }
  }
}

function Entity(drawer) {
  this.loc = null;
  this.drawer = drawer;
}

Entity.prototype.update = function () {
  
}

Entity.prototype.draw = function(x, y) {
  this.drawer.draw(x, y);
}

function RedRectangle() {}

RedRectangle.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, 30, 30);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}

function Robot() {
  this.
}

Robot.prototype.draw = function draw(x, y) {
  drawImage("robot_image", 30, 30, x, y);
}


// Drawing

function drawImage(imageId, width, height, x, y) {
  var image = document.getElementById(imageId);
  ctx.drawImage(image, x, y, width, height);
}