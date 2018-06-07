const express = require('express');
const router = express.Router();
const db = require('../models/db.js');
const fs = require('fs');

/*function getLevelIntroContext(levelName, callback) {
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

var introContext = null;*/

function getLevel(levelName, callback) {
  console.log("Trying to get level: " + levelName);
  fs.readFile('shared/levels/' + levelName + '/' + levelName + '.lev', 'utf8',
    function (err, data) {
      console.log("Level is:");
      console.log(data);
      
      callback(data);
    }
  );
}

var loops1Context = {
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

var intro1Context = {
  student: false,
  concept: "Introduction",
  concept_description: ["Hey there! Welcome to the land of EduBot! In this first set of levels, we're going to introduce you to the basics of how to guide EduBot.", "You see, EduBot is a hungry critter, constantly on the search for more nuts and bolts to consume.", "We'll show you how to get EduBot moving and get it started on its search for food!"],

  level_name: "Level 1 - Basic Movement",
  blocks_available: "../images/move_forward_block.png",

  objective: "Eat the single bolt",

  hints: ["You program EduBot by dragging and dropping blocks into the space on the left of the screen. You can get EduBot to carry out your program by clicking run.", "Blocks are like puzzle pieces, you can connect them together to create more useful programs!", "Each block corresponds to a specific action or piece of logic for EduBot to use."],

  level_image: "../images/intro_1.png"
};

var intro2Context = {
  student: false,
  concept: "Introduction",
  concept_description: ["Hey there! Welcome to the land of EduBot! In this first set of levels, we're going to introduce you to the basics of how to guide EduBot.", "You see, EduBot is a hungry critter, constantly on the search for more nuts and bolts to consume.", "We'll show you how to get EduBot moving and get it started on its search for food!"],

  level_name: "Level 2 - Rotation",
  blocks_available: "../images/movement_blocks.png",

  objective: "Eat the two bolts",

  hints: ["You program EduBot by dragging and dropping blocks into the space on the left of the screen. You can get EduBot to carry out your program by clicking run.", "EduBot always moves forwards. You can change its direction by dragging and connecting rotate left and right blocks.", "If you want to attempt the level again, simply press the restart button."],

  level_image: "../images/intro_2.png"
};

var intro3Context = {
  student: false,
  concept: "Introduction",
  concept_description: ["Hey there! Welcome to the land of EduBot! In this first set of levels, we're going to introduce you to the basics of how to guide EduBot.", "You see, EduBot is a hungry critter, constantly on the search for more nuts and bolts to consume.", "We'll show you how to get EduBot moving and get it started on its search for food!"],

  level_name: "Level 3 - Rotation",
  blocks_available: "../images/movement_blocks.png",

  objective: "Guide EduBot around the wall and eat the bolt",

  hints: ["You program EduBot by dragging and dropping blocks into the space on the left of the screen. You can get EduBot to carry out your program by clicking run.", "Use a combination of rotation and movement blocks to send EduBot around the wall.", "Try and create a single program set of blocks that will EduBot all the way from the start position to the final bolt. You can try again by pressing restart."],

  level_image: "../images/intro_3.png"
};

router.get('/level_intro', (req, res, next) => {
  let levelName = req.query.levelId;

  let context = null;

  switch (levelName) {
    case "intro_1":
      context = intro1Context;
      break;
    case "intro_2":
      context = intro2Context;
      break;
    case "intro_3":
      context = intro3Context;
      break;
    case "loops_1":
      context = loops1Context;
      break;
  }

  if (context !== null) {
    context.level_id = levelName;
    res.render('shared/level_intro', context);
  }
});

router.get('/play', async function(req, res, next) {
  var uname = req.cookies["edubot-cookie"];
  var type = db.userTypeEnum.NEITHER;
  try {
    type = await db.getUserType(uname);
  } catch(e) {
    next(e);
  };
  student = false;
  if (type === db.userTypeEnum.STUDENT) {
    student = true;
  }
  
  let levelName = req.query.levelId;
  let context = {student: true};
  
  getLevel(levelName, function (jsonLevel) {
    console.log("Context before:");
    console.log(context);
    context.json_level = jsonLevel
  });
  
  console.log("Context after:");
  console.log(context);
  
  res.render('shared/play', context);
});

module.exports = router;
