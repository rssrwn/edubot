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
  let teacher = req.cookies["edubot-cookie"];
  let studentInfo = await db.getUserInfo(studentId);
  let results = await db.getLevelResults(studentId);
  let currLevel = await db.getCurrLevel(studentId);

  /*var categories = [
    {
      categoryName: "Introduction",
      levels: [
        {stars: results[0], number: 1, name: "Moving EduBot", link: '/shared/play?levelId=intro_1&studentId=' + studentId},
        {stars: results[1], number: 2, name: "Movement and Rotation", link: '/shared/play?levelId=intro_2&studentId=' + studentId},
        {stars: results[2], number: 3, name: "Obstacles", link: '/shared/play?levelId=intro_3&studentId=' + studentId}
      ]
    },
    {
      categoryName: "Looping",
      levels: [
        {stars: results[3], number: 4, name: "Basic looping", link: '/shared/play?levelId=loops_1&studentId=' + studentId},
        {stars: results[4], number: 5, name: "Advanced looping", link: '/shared/play?levelId=loops_1&studentId=' + studentId}
      ]
    }
  ];*/

  //let categories = await db.getAllLevels(studentId, teacher, true);
  let categories = await db.getAllLevels(studentId, true);

  let context = {
    student: false,
    studentInfo: studentInfo,
    categories: categories
  };

  /*for (var i=0; i<categories.length; i++) {
    let levels = categories[i].levels;
    for (var j=0; j<levels.length; j++) {
      let level = levels[j];
      level.locked = true;
      if (level.number <= currLevel) {
        level.locked = false;
      }
      //console.log(level);
    }
  }*/

  res.render('shared/level_selection', context);
});

router.get('/solution', async function(req, res, next) {
  let levelName = req.query.levelId;
  let context = {student: false};

  util.getLevelData(levelName, 'lev').then(jsonLevel => {
    context.json_level = jsonLevel;

    util.getLevelData(levelName, 'blocks').then(xmlBlocks => {
      context.xml_blocks = xmlBlocks;

      util.getLevelData(levelName, 'sol').then(jsonLevel => {
        context.json_solution = jsonLevel;
          res.render('shared/play', context);
      }).catch((error) => next(error));
    }).catch((error) => next(error));
  }).catch((error) => next(error));
});

router.get('/level_selection', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];

  /*let context = {
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
  };*/

  //let categories = await db.getAllLevels(null, teacher, false);
  let categories = await db.getAllLevels(teacher, false);

  let context = {
    student: false,
    categories: categories
  };

  res.render('shared/level_selection', context);
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
  if (status === 0) {
    res.sendStatus(200);
  } else if (status === -1) {
    res.status(480).send("That username does not have an account");
  } else if (status === -2) {
    res.status(481).send("That username is alreday in a class");
  } else {
    res.status(500).send("Unknown error");
  }
});

router.post('/remove_member', async function(req, res, next) {
  const body = req.body;
  let uname = req.cookies["edubot-cookie"];

  let status = await db.removeMember(uname, body.uname, body.class_id);
  if (status === 0) {
    res.sendStatus(200);
  } else if (status === -1) {
    res.status(480).send("That username does not have an account");
  } else if (status === -2) {
    res.status(481).send("That username is not in a class");
  } else if (status === -3) {
    res.status(482).send("You do not have permission");
  } else {
    res.status(500).send("Unknown error");
  }
});

router.post('/remove_class', async function(req, res, next) {
  const body =req.body;
  let uname = req.cookies["edubot-cookie"];

  let status = await db.removeClass(uname, body.class_id);
  if (status === 0) {
    res.sendStatus(200);
  } else if (status === -1) {
    res.status(480).send("Either that class does not exist or you do not have permission");
  } else {
    res.status(500).send("Unknown error");
  }
});

router.post('/add_feedback', async function(req, res, next) {
  const body =req.body;
  let teacher = req.cookies["edubot-cookie"];

  let status = await db.addFeedback(body.uname, body.level, teacher, body.feedback);
  if (status === -1) {
    res.status(480).send("That username does not exist");
  } else if (status === -2) {
    res.status(481).send("You do not have permission");
  } else if (status === 0) {
    res.sendStatus(200);
  } else {
    res.status(500).send("Unknown error");
  }
});

module.exports = router;
