const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_selection', (req, res, next) => {
  var context = {
    student: true,
    categorys: [
      {
        categoryName: "Introduction",
        levels: [
          {
            stars: 1,
            number: 1
          },
          {
            stars: 3,
            number: 2
          }
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {
            stars: 2,
            number: 1
          },
          {
            stars: 0,
            number: 2
          }
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
