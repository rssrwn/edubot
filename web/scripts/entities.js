function Entity() {
  this.loc = null;
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

RedRectangle.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, 30, 30);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
}