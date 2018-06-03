
function RobotAnims() {
  this.robotBodyImage = new Image();
  this.robotArmsImage = new Image();
  this.robotEyesImage = new Image();
  this.armsPhase = 0.0;
  this.blinkDelay = 2.5;
  this.blinkTime = 0.5;
  this.blinkScaleModifier = 0.5;
  this.blinkEnd = 0;
  this.isBlinking = false;
  this.eyeOffset = 64 * level.squareSize / 256;

  this.robotBodyImage.src = "../images/edubot_body.png";
  this.robotArmsImage.src = "../images/edubot_arms.png";
  this.robotEyesImage.src = "../images/edubot_eyes.png";
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
  this.blinkEnd = level.runtimeMillis + this.blinkDelay;
}

// Receives the centre around which the robot should be drawn.
RobotAnims.prototype.draw = function (x, y) {
  if (this.isBlinking) {
    if (level.runtimeMillis > this.blinkEnd) {
      this.endBlink();
    } else {
      this.blinkScaleModifier -= frameTime / 1000.0 * blinkTime;
    }
  } else if (level.runtimeMillis > this.blinkEnd) {
    this.blink();
  }
  
  let width = level.squareSize;
  
  ctx.drawImage(this.robotBodyImage, x - width / 2, y - width / 2, width, width);
  ctx.drawImage(this.robotArmsImage, x - width / 2, y - width / 2, width, width);
  ctx.translate(this.eyeOffset, 0);
  ctx.scale(0.5 + Math.abs(this.blinkScaleModifier), 1.0);
  ctx.drawImage(this.robotEyesImage, x - width / 2, y - width / 2, width, width);
}