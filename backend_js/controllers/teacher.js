const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/classes', (req, res, next) => {
  let uname = req.cookies["edubot-cookie"];
  let class_data = [];
  let class_ids = db.getClasses(uname);
  for (let i = 0; i < class_ids.length; i++) {
    let members = db.getMembers(class_ids[i]);
    let class_info = [];
    class_info.class_name = getClassName(class_ids[i]);
    for (let j = 0; j < members.length; j++) {
      let member_info = getUserInfo(members[j]);
      class_info.append(member_info);
    }
    class_data.append(class_info);
  }
  
  var context = {
    class_list: class_data
    // [{
    //   class_name: 'Group 14',
    //   class_members: [{ fname: 'Harry', lname: 'Davis', age: 20, uname: 16},
    //                   { fname: 'Ross', lname: 'Irwin', age: 20, uname: 616},
    //                   { fname: 'Jordan', lname: 'Glanfield', age: 20, uname: 1216},
    //                   { fname: 'Julien', lname: 'Amblard', age: 19, uname: 1616}]
    // }, {
    //   class_name: 'Older Members',
    //   class_members: [{ fname: 'Mark', lname: 'Wheelhouse', age: 0, uname: 322}]
    // }]
  };

  res.render('teacher/classes', context);
});

router.get('/student', (req, res, next) => {
  res.send('hello world');
});

router.get('/solution', (req, res, next) => {
  
});

router.get('/level_selection', (req, res, next) => {
  var context = {
    student: false,
    categories: [
      {
        categoryName: "Introduction",
        levels: [
          {number: 1, name: "Using blocks"},
          {number: 2, name: "Basic movement"},
          {number: 3, name: "Advanced movement"}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {number: 1, name: "Basic looping", link: '/shared/level_intro'},
          {number: 2, name: "Advanced looping"}
        ]
      }
    ]
  };
  res.render('teacher/level_select', context);
});

router.get('/account', (req, res, next) => {

});

router.post('/add_class', (req, res, next) => {

});

router.post('/add_member', (req, res, next) => {

});

/*
router.post('/classroom', (req, res, next) => {

});
*/

module.exports = router;
