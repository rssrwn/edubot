const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let results = await db.getLevelResults(uname);
  let currLevel = await db.getCurrLevel(uname);
  let categories = await db.getAllLevels(uname);

  var context = {
    feedback: true,
    student: true,
    categories: categories,
    currLevel: currLevel
  };

  res.render('shared/level_selection', context);
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
