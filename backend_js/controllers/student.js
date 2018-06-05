const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', (req, res, next) => {
  var context = {
    student: true,
    levels: [
    {
      number: 1,
      score_z: false,
      score_o: true,
      score_t: false,
      score_th: false
    },
    {
      number: 2,
      score_z: true,
      score_t: false,
      score_t: false,
      score_th: false
    }]
  };
  res.render('student/level_select', context);
});

router.get('/level_results', (req, res, next) => {

});

router.get('/account', (req, res, next) => {

});

module.exports = router;
