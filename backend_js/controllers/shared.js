const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

var introContext = {
  student: false,
  concept: "Loops and Conditionals",
  concept_description: "<p> So far we have covered simple instructions such as move forward, turn left and turn right, using these to feed poor edubot. However, when the environment becomes larger or more complicated, manually telling edubot what to do will become tedious. A level with 20 bolts to eat will require at minimum 20 code blocks!</p> <p> This is where loops and conditionals come in. A loop lets edubot repeat an action multiple times. It may repeat a fixed number of times or perhaps repeat until edubot hits a wall. By taking advantage of patterns in the level, we can code edubot using far fewer instructions.</p>",
  
  level_name: "Level 1 - Basic Object Oriented Programming",
  blocks_available: "<img id=\"blocksImage\" src=\"../images/loops_blocks.png\" alt=\"Available blocks\"></img>",
  
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
