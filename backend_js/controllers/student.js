const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let results = await db.getLevelResults(uname);
  var context = {
    student: true,
    categories: [
      {
        categoryName: "Introduction",
        levels: [
          {stars: results[0], number: 1, name: "Moving EduBot", link: '/shared/level_intro?levelId=intro_1'},
          {stars: results[1], number: 2, name: "Movement and Rotation", link: '/shared/level_intro?levelId=intro_2'},
          {stars: results[2], number: 3, name: "Obstacles", link: '/shared/level_intro?levelId=intro_3'}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {stars: results[3], number: 4, name: "Basic looping", link: '/shared/level_intro?levelId=loops_1'},
          {stars: results[4], number: 5, name: "Advanced looping", link: '/shared/level_intro?levelId=loops_1'}
        ]
      }
    ]
  };
  res.render('student/level_select', context);
});

router.post('/set_result', async function(req, res, next) {
  //console.log('set result called');
  let uname = req.cookies["edubot-cookie"];
  const body = req.body;

  let success = await db.setResult(uname, body.level, body.score);

  //console.log(success);
  if (success === -1) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
});

router.get('/level_results', (req, res, next) => {
  let levelName = req.query.levelId;
  let nextLevel = req.query.nextId;
  let levelStars = req.query.sts;

  console.log(levelStars);

  let context = {
    student: true,
    stars: levelStars,
    level_id: levelName,
    next_level_id: nextLevel
  };

  res.render('student/level_results', context);
});

router.get('/account', (req, res, next) => {

});

module.exports = router;
