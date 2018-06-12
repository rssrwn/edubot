const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let results = await db.getLevelResults(uname);
  let currLevel = await db.getCurrLevel(uname);

  console.log('level select');

  var categories = [
    {
      conceptId: "intro",
      categoryName: "Introduction",
      levels: [
        {stars: results[0], number: 1, name: "Moving EduBot", link: '/shared/level_intro?levelId=intro_1'},
        {stars: results[1], number: 2, name: "Movement and Rotation", link: '/shared/level_intro?levelId=intro_2'},
        {stars: results[2], number: 3, name: "Obstacles", link: '/shared/level_intro?levelId=intro_3'}
      ]
    },
    {
      conceptId: "loops",
      categoryName: "Looping",
      levels: [
        {stars: results[3], number: 4, name: "Basic looping", link: '/shared/play?levelId=loops_1'},
        {stars: results[4], number: 5, name: "Looping with rotation", link: '/shared/play?levelId=loops_2'},
        {stars: results[5], number: 6, name: "Looping with obstacles", link: '/shared/play?levelId=loops_3'}
      ]
    }
  ];

  for (var i=0; i<categories.length; i++) {
    let levels = categories[i].levels;
    for (var j=0; j<levels.length; j++) {
      let level = levels[j];
      level.locked = true;
      if (level.number <= currLevel) {
        level.locked = false;
      }
      //console.log(level);
    }
  }

  var context = {
    student: true,
    categories: categories,
    currLevel: currLevel
  };

  res.render('student/level_select', context);
});

router.get('/level_results', (req, res, next) => {
  let levelName = req.query.levelId;
  let nextLevel = req.query.nextId;
  let levelStars = req.query.sts;

  let context = {
    student: true,
    stars: levelStars,
    level_id: levelName,
    next_level_id: nextLevel
  };

  console.log("About to render level results with stars: " + context.stars);

  res.render('student/level_results', context);
});

router.get('/curr_level', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let curr_level = await db.getCurrLevel(uname);
  console.log("get /curr_level: ", curr_level);
  res.send(curr_level);
});

router.get('/account', (req, res, next) => {

});

module.exports = router;
