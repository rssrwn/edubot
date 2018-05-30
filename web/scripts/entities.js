function Entity() {
  this.loc = null;
  this.updateState = false;
}

function RedRectangle() {
  Entity.call(this);
}

RedRectangle.prototype = Object.create(Entity.prototype);

Entity.prototype.update = function() {}
Entity.prototype.draw = function(x, y) {}

Entity.prototype.setLocation = function(point) {
  level.moveEntity(this, point);
}

Entity.prototype.needsUpdating = function(updateTrueState) {
  return this.updateState != updateTrueState;
}

RedRectangle.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, level.squareSize, level.squareSize);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}