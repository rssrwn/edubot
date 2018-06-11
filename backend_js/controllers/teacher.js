const express = require('express');
const router = express.Router();
const db = require('../models/db.js');
const util = require('../models/util.js');
const fs = require('fs');

router.get('/classes', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let class_data = [];
  let class_ids = await db.getClasses(uname);

  for (let i = 0; i < class_ids.length; i++) {
    let members = await db.getMembers(class_ids[i]);
    let class_info = {};
    class_info.class_id = class_ids[i];
    class_info.class_name = await db.getClassName(class_ids[i]);
    class_info.class_members = [];

    for (let j = 0; j < members.length; j++) {
      let member_info = await db.getUserInfo(members[j]);
      class_info.class_members.push(member_info);
    }

    class_data.push(class_info);
  }

  var context = {
    class_list: class_data
  };

  res.render('teacher/classes', context);
});

router.get('/student', async function(req, res, next) {
  let studentId = req.query.userId;
  let studentInfo = await db.getUserInfo(studentId);
  let results = await db.getLevelResults(studentId);
  
  let context = {
    student: false,
    studentInfo: studentInfo,
    categories: [
      {
        categoryName: "Introduction",
        levels: [
          {stars: results[0], number: 1, name: "Moving EduBot", link: '/shared/play?levelId=intro_1?studentId=' + studentId},
          {stars: results[1], number: 2, name: "Movement and Rotation", link: '/shared/play?levelId=intro_2?studentId=' + studentId},
          {stars: results[2], number: 3, name: "Obstacles", link: '/shared/play?levelId=intro_3?studentId=' + studentId}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {stars: results[3], number: 4, name: "Basic looping", link: '/shared/play?levelId=loops_1?studentId=' + studentId},
          {stars: results[4], number: 5, name: "Advanced looping", link: '/shared/play?levelId=loops_1?studentId=' + studentId}
        ]
      }
    ]
  };
  res.render('teacher/level_select', context);
});

router.get('/solution', async function(req, res, next) {
  let levelName = req.query.levelId;
  let context = {student: false};

  util.getLevelData(levelName, 'lev', function(jsonLevel) {
    context.json_level = jsonLevel;
  });
  
  util.getLevelData(levelName, 'blocks', function(xmlBlocks) {
    context.xml_blocks = xmlBlocks;
  });
  
  util.getLevelData(levelName, 'sol', function(jsonLevel) {
    context.json_solution = jsonLevel;
    res.render('shared/play', context);
  });
});

router.get('/level_selection', (req, res, next) => {
  let context = {
    student: false,
    categories: [
      {
        categoryName: "Introduction",
        levels: [
          {number: 1, name: "Moving EduBot", link: '/shared/level_intro?levelId=intro_1'},
          {number: 2, name: "Movement and Rotation", link: '/shared/level_intro?levelId=intro_2'},
          {number: 3, name: "Obstacles", link: '/shared/level_intro?levelId=intro_3'}
        ]
      },
      {
        categoryName: "Looping",
        levels: [
          {number: 4, name: "Basic looping", link: '/shared/level_intro?levelId=loops_1'},
          {number: 5, name: "Advanced looping", link: '/shared/level_intro?levelId=loops_1'}
        ]
      }
    ]
  };
  
  res.render('teacher/level_select', context);
});

router.get('/account', (req, res, next) => {

});

router.post('/add_class', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  let sch_id = await db.getSchId(uname);
  if (sch_id === -1) {
    res.status(480).send("Teacher does not exist");
  }

  const body = req.body;
  var success = await db.insertClass(body.name, sch_id, uname);
  if (success !== -1) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

router.post('/add_member', async function(req, res, next) {
  const body = req.body;
  var status = await db.addMember(body.uname, body.class_id);
  if (status === 1) {
    res.sendStatus(200);
  } else if (status === -1) {
    res.status(480).send("That username does not have an account");
  } else if (status === -2) {
    res.status(481).send("That username is alreday in a class");
  } else {
    res.status(500).send("Unknown error");
  }
});

/*
router.post('/classroom', (req, res, next) => {

});
*/

module.exports = router;
