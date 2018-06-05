var robotBodyImage = new Image();
var robotArmsImage = new Image();
var robotEyesImage = new Image();

robotBodyImage.src = "../images/edubot_body.png";
robotArmsImage.src = "../images/edubot_arms.png";
robotEyesImage.src = "../images/edubot_eyes.png";

function RobotAnims() {
  this.armsPhase = 0.0;
  this.blinkDelay = 2.5;
  this.blinkTime = 0.5;
  this.blinkScaleModifier = 0.5;
  this.blinkRange = 1.0;
  this.blinkEnd = 0;
  this.isBlinking = false;
  this.eyeOffset = 48 * level.squareSize / 256;
}

RobotAnims.prototype.init = function () {
  
}

RobotAnims.prototype.blink = function () {
  this.isBlinking = true;
  this.blinkEnd = level.runtimeMillis + this.blinkTime * 1000.0;
}

RobotAnims.prototype.endBlink = function () {
  this.isBlinking = false;
  this.blinkScaleModifier = 0.5;
  this.blinkEnd = level.runtimeMillis + this.blinkDelay * 1000.0;
}

// Receives the centre around which the robot should be drawn.
RobotAnims.prototype.draw = function (x, y) {
  if (this.isBlinking) {
    if (level.runtimeMillis > this.blinkEnd) {
      this.endBlink();
    } else {
      this.blinkScaleModifier -= (frameTime / 1000.0) / this.blinkTime * this.blinkRange;
    }
  } else if (level.runtimeMillis > this.blinkEnd) {
    this.blink();
  }
  
  let width = level.squareSize;
  
  ctx.drawImage(robotArmsImage, x - width / 2, y - width / 2, width, width);
  ctx.drawImage(robotBodyImage, x - width / 2, y - width / 2, width, width);
  ctx.translate(this.eyeOffset, 0);
  ctx.scale(0.5 + Math.abs(this.blinkScaleModifier), 1.0);
  ctx.drawImage(robotEyesImage, x - width / 2, y - width / 2, width, width);
}