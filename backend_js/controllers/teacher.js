const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/classes', (req, res, next) => {
  // var context = {
  //   student: false,
  //   class_list: [{
  //     class_name: 'Group 14',
  //     class_members: [{ fname: 'Harry', lname: 'Davis', age: 20, uname: 16},
  //                     { fname: 'Ross', lname: 'Irwin', age: 20, uname: 616},
  //                     { fname: 'Jordan', lname: 'Glanfield', age: 20, uname: 1216},
  //                     { fname: 'Julien', lname: 'Amblard', age: 19, uname: 1616}]
  //   }, {
  //     class_name: 'Older Members',
  //     class_members: [{ fname: 'Mark', lname: 'Wheelhouse', age: 0, uname: 322}]
  //   }]
  // };
  var context = {
    student: false,
    class_list: [{
      class_name: 'class1',
      class_members: ['Harry', 'Ross', 'Jordan', 'Julien']
    }]
  };

  res.render('teacher/classes', context);
});

router.get('/student', (req, res, next) => {
  res.send('hello world');
});

router.get('/level_selection', (req, res, next) => {

});

router.get('/account', (req, res, next) => {

});

/*
router.post('/classroom', (req, res, next) => {

});
*/

module.exports = router;
