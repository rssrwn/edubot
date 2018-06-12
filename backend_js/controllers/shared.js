const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../models/db.js');
const util = require('../models/util.js')
const fs = require('fs');

/*
Note, to save the model solutions for a level, simply use:
var xml = Blockly.Xml.workspaceToDom(workspace);
var xml_text = Blockly.Xml.domToText(xml);

In the console. The XML for the blocks will then be stored in variable xml_text.
*/

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

router.get('/concept', async function(req, res, next) {
  let conceptName = req.query.conceptId;
  let contextJSON = await util.getConceptData(conceptName, 'ctx');
  let context = JSON.parse(contextJSON);

  if (context !== null && context !== undefined) {
    let uname = req.cookies["edubot-cookie"];
    context.student = await util.isStudent(uname);
    res.render('shared/concept', context);
  }
});

router.get('/level_intro', async function(req, res, next) {
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
    let uname = req.cookies["edubot-cookie"];
    context.student = await util.isStudent(uname);
    context.level_id = levelName;
    res.render('shared/level_intro', context);
  } else {
    res.sendStatus(500);
  }
});

router.get('/play', async function(req, res, next) {
  let levelName = req.query.levelId;
  let uname = req.cookies["edubot-cookie"];
  let isStudent = await util.isStudent(uname);
  let context = {student: isStudent, tutorial: levelName === "intro_1" && isStudent, levelName: levelName};

  let studentId = req.query.studentId;

  if (studentId != null) {
    let sol = await db.getSolution(studentId, levelName);
    context.json_solution = sol;
  }

  util.getLevelData(levelName, 'lev').then(jsonLevel => {
    context.json_level = jsonLevel;

    util.getLevelData(levelName, 'blocks').then(xmlBlocks => {
      context.xml_blocks = xmlBlocks;
      res.render('shared/play', context);
    }).catch((error) => next(error));
  }).catch((error) => next(error));
});

router.post('/set_result', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  const body = req.body;

  let success = await db.setResult(uname, body.level, body.score, body.solution);

  if (success === -1) {
    res.status(251).send("That username is not a student");
  } else if (success === 1) {
    res.sendStatus(250);
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;
