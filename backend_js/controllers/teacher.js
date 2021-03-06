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
  let currLevel = await db.getCurrLevel(studentId);
  let categories = await db.getAllLevels(studentId);

  let context = {
    feedback: true,
    student: false,
    studentInfo: studentInfo,
    categories: categories
  };

  res.render('shared/level_selection', context);
});

router.get('/solution', async function(req, res, next) {
  let levelName = req.query.levelId;
  let context = {student: false};
  context.levelName = levelName;

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
  let categories = await db.getAllLevels(uname);

  let context = {
    feedback: false,
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
