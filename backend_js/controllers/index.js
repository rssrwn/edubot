const express = require('express');
const path = require('path');
const db = require('../models/db.js');
const util = require('../models/util.js');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', async function(req, res, next) {
  //let info = await db.getAllLevels('user2');
  //let info = await db.getCurrLevelName('user2');
  //let info = await db.getFeedback('user2', 'loops_2');
  //let info = await db.addFeedback('user2', 'intro_2', 'teacher2', 'Rotating is a very advanced topic, well done. 11/10');
  let info = await db.setTempSol('user2', 'conds_1', 'temp sol2');
  //let info = await db.getUserInfo('user2');
  console.log(info);
  res.sendStatus(200);
});

router.get('/', async function(req, res, next) {
  let uname = req.cookies["edubot-cookie"];
  
  if (uname == null) {
    res.sendFile(path.join(__dirname + './../public/login.html'));
  } else {
    let isStudent = await util.isStudent(uname);
    
    if (isStudent) {
      res.redirect('/student/level_selection');
    } else {
      res.redirect('/teacher/classes');
    }
  }
});

router.get('/logout', (req, res, next) => {
  res.clearCookie("edubot-cookie");
  res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;
