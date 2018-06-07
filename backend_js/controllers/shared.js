const express = require('express');
const router = express.Router();
const db = require('../models/db.js');
/*const fs = require('fs');

function getLevelIntroContext(levelName, callback) {
  fs.readFile('../shared/levels/' + levelName + '/' + levelName + '.ctx', 'utf8', function (err, data) {
    if (data !== null) {
      console.log("Context is:");
      console.log(data);
      let ctx = JSON.parse(data);
      callback(ctx);
    } else {
      console.log("Failed to read level intro context")
    }
  });
}

var introContext = null;

getLevelIntroContext("intro_1", function (ctx) {introContext = ctx});*/

var introContext = {
  student: false,
  concept: "Loops and Conditionals",
  concept_description: ["So far we have covered simple instructions such as move forward, turn left and turn right, using these to feed poor edubot.", "However, when the environment becomes larger or more complicated, manually telling edubot what to do will become too long.", "A level with 20 bolts to eat will require at minimum 20 code blocks!", "This is where loops and conditionals come in. A loop lets edubot repeat an action multiple times.", "It may repeat a fixed number of times or perhaps repeat until edubot hits a wall. By taking advantage of patterns in the level, we can code edubot using far fewer instructions."],
  
  level_name: "Level 1 - Basic Loops",
  blocks_available: "../images/loops_blocks.png",
  
  objective: "Eat all bolts in the level in as few moves as possible",
  
  hints: ["You can program your robot to behave differently when it encounters a wall by adding a wall in front block to a repeat-while block.",
  "If you're stuck, you can start by manually guiding the robot around the level and seeing what patterns appear in the actions, and what can be placed in a loop."],
  
  level_image: "../images/loops_and_iteration_1.png"
};

router.get('/level_intro', (req, res, next) => {
  res.render('shared/level_intro', introContext);
});

router.get('/play', (req, res, next) => {
  res.render('shared/play', {});
});

module.exports = router;
