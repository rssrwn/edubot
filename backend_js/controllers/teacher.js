const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/classes', (req, res, next) => {

});

router.get('/student', (req, res, next) => {
  res.send('hello world');
});

router.get('/level_selection', (req, res, next) => {
  var context = {
    class_list: [{
      class_name: 'class1',
      class_members: ['Harry', 'Ross', 'Jordan', 'Julien']
    }]
  };
  res.render('teacher/classes', context);
});

router.get('/account', (req, res, next) => {

});

/*
router.post('/classroom', (req, res, next) => {

});
*/

module.exports = router;
