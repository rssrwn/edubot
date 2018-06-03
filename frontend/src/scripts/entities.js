function Entity(blocksEntities, entityId) {
  this.loc = null;
  this.blocksEntities = blocksEntities;
  this.updateState = false;
  this.entityId = entityId;
}

function Bolt() {
  Entity.call(this, false, "Bolt");
}

function BasicWall() {
  Entity.call(this, true, "BasicWall");
}

Bolt.prototype = Object.create(Entity.prototype);
BasicWall.prototype = Object.create(Entity.prototype);

Entity.prototype.update = function () {}
Entity.prototype.draw = function (x, y) {}
Entity.prototype.isBlocking = function () {return this.blocksEntities}
Entity.prototype.isRobot = function () {return false}

Entity.prototype.setLocation = function(point) {
  level.moveEntity(this, point);
}

Entity.prototype.needsUpdating = function(updateTrueState) {
  return this.updateState != updateTrueState;
}

Entity.prototype.added = function() {}
Entity.prototype.removed = function() {}

Bolt.prototype.draw = function draw(x, y) {
  //ctx.beginPath();
  //radius = level.squareSize / 4;
  drawImage("nuts_and_bolts", x, y, level.squareSize, level.squareSize);
  //ctx.arc(x + level.squareSize / 2, y + level.squareSize / 2, radius, 0, 2*Math.PI);
  //ctx.fillStyle = "#008000";
  //ctx.fill();
  //ctx.closePath();
}

Bolt.prototype.added = function() {
  level.boltAdded();
}

Bolt.prototype.removed = function() {
  level.boltCollected();
}

BasicWall.prototype.draw = function draw(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, level.squareSize, level.squareSize);
  ctx.fillStyle = "#303080";
  //ctx.fillStyle = "#FF00FF";
  ctx.fill();
  ctx.closePath();
}

