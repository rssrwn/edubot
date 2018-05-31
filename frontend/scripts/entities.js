function Entity(blocksEntities) {
  this.loc = null;
  this.blocksEntities = blocksEntities;
  this.updateState = false;
}

function BasicFood() {
  Entity.call(this, false);
}

function BasicWall() {
  Entity.call(this, true);
}

BasicFood.prototype = Object.create(Entity.prototype);
BasicWall.prototype = Object.create(Entity.prototype);

Entity.prototype.update = function() {}
Entity.prototype.draw = function(x, y) {}
Entity.prototype.isBlocking = function() {return this.blocksEntities}

Entity.prototype.setLocation = function(point) {
  level.moveEntity(this, point);
}

Entity.prototype.needsUpdating = function(updateTrueState) {
  return this.updateState != updateTrueState;
}

BasicFood.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  radius = level.squareSize / 4;
  ctx.arc(x + level.squareSize / 2, y + level.squareSize / 2, radius, 0, 2*Math.PI);
  ctx.fillStyle = "#008000";
  ctx.fill();
  ctx.closePath();
}

BasicWall.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, level.squareSize, level.squareSize);
  ctx.fillStyle = "#303030";
  ctx.fill();
  ctx.closePath();
}

