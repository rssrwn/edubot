var sampleLevel1 = new GridLevel(15, 15, 48);

initSampleLevel1();

function initSampleLevel1() {
  level = sampleLevel1;
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
  
  edubot = new Robot();
  
  l.addEntity(edubot, x, y);
  
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
  
  level = sampleLevel1;
}