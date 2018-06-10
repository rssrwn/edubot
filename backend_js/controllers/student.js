const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', (req, res, next) => {
  var context = {
    student: true,
    categories: [
      {
        categoryName: "Introduction",
        levels: [
          {stars: 1, number: 1, name: "Moving EduBot", link: '/shared/level_intro?levelId=intro_1'},
          {stars: 3, number: 2, name: "Movement and Rotation", link: '/shared/level_intro?levelId=intro_2'},
          {stars: 2, number: 3, name: "Obstacles", link: '/shared/level_intro?levelId=intro_3'}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {stars: 2, number: 4, name: "Basic looping", link: '/shared/level_intro?levelId=loops_1'},
          {stars: 0, number: 5, name: "Advanced looping", link: '/shared/level_intro?levelId=loops_1'}
        ]
      }
    ]
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
  
  res.render('student/level_results', context);
});

router.get('/account', (req, res, next) => {

});

module.exports = router;
