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
          {stars: 1, number: 1, name: "Using blocks"},
          {stars: 3, number: 2, name: "Basic movement"},
          {stars: 2, number: 3, name: "Advanced movement"}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {stars: 2, number: 1, name: "Basic looping"},
          {stars: 0, number: 2, name: "Advanced looping"}
        ]
      }
    ]
  };
  res.render('student/level_select', context);
});

router.get('/level_results', (req, res, next) => {

});

router.get('/account', (req, res, next) => {

});

module.exports = router;
