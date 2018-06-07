const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../models/db.js');

router.post('/', async function(req, res, next) {
  const body = req.body;
  type = db.userTypeEnum.NEITHER;
  try {
    type = await db.getUserType(body.uname);
  } catch(e) {
    next(e);
  };

  var success = await db.attemptLogin(body.uname, body.pass);
  if (success) {
    res.cookie('edubot-cookie', body.uname);

    // Student login
    if (type === db.userTypeEnum.STUDENT) {
      console.log('sudent login');
      //res.cookie('edubot-cookie', 'student');
      res.sendStatus(250);

    // Teacher login
    } else if (type === db.userTypeEnum.TEACHER) {
      //res.cookie('edubot-cookie', 'teacher');
      res.sendStatus(251);
    }
    return;

  } else {
    res.status(401).send("Failed login");
  }
});

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;
