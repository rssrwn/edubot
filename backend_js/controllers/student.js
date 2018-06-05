const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', (req, res, next) => {
  var context = {
    student: true,
    levels: [
    {
      number: 1,
      score0: false,
      score1: true,
      score2: false,
      score3: false
    },
    {
      number: 2,
      score0: true,
      score1: false,
      score2: false,
      score3: false
    }]
  };
  res.render('student/level_select', context);
});

router.get('/level_results', (req, res, next) => {

});

router.get('/account', (req, res, next) => {

});

module.exports = router;
