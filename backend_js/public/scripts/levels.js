var sampleLevel1 = null;

initSampleLevel1();

function initSampleLevel1() {
  sampleLevel1 = new GridLevel(15, 15, defaultSquareSize);
  setLevel(sampleLevel1);
  let l = sampleLevel1;
  
  for (let i = 0; i < l.width; i++) {
    l.addEntity(new BasicWall(), i, 0);
    l.addEntity(new BasicWall(), i, l.height - 1);
  }
  
  for (let i = 0; i < l.height; i++) {
    l.addEntity(new BasicWall(), 0, i);
    l.addEntity(new BasicWall(), l.width - 1, i);
  }
  
  let x = 7;
  let y = 10;
  
  let robot = new Robot();
  
  l.setRobot(robot);
  l.addEntity(robot, x, y);
  
  x++;
  
  for (let i = 0; i < 3; i++, x++) {
    l.addEntity(new Bolt(), x, y);
  }
  
  l.addEntity(new BasicWall(), x, y);
  
  x--;
  
  y -= 2;
  
  for (let i = 0; i < 3; i++, y--) {
    l.addEntity(new Bolt(), x, y);
  }
  
  l.addEntity(new BasicWall(), x, y);
  
  y++;
  x--;
  
  for (let i = 0; i < 5; i++, x--) {
    l.addEntity(new Bolt(), x, y);
  }
  
  x -= 2;
  l.addEntity(new BasicWall(), x, y);
  
  x++;
  
  y++;
  
  for (let i = 0; i < 2; i++, y--) {
    l.addEntity(new Bolt(), x, y);
  }
  
  l.hints.push("You can program your robot to behave differently when it encounters a "
  + "wall by adding a \"wall in front\" block to an if or repeat-while block");
  l.hints.push("If you're stuck, you can start by manually guiding the robot around "
    + "the level and seeing what patterns appear in the actions, and what can be placed "
    + "in a loop");
  l.hintCounter = randomInt(2);
  
  l.minActions = 18;
  l.maxActions = 30;
}

function restartLevel() {
  clearTimeout(executionTimeoutId);
  
  if (levelSource !== null) {
    enterLevel(levelSource);
  } else {
    initSampleLevel1();
  }
}