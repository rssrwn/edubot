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
  let info = await db.getTempSol('user2', 'intro_1');
  //let info = await db.getUserInfo('user2');
  console.log(info);
  res.sendStatus(200);
});

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + './../public/login.html'));
});

router.get('/logout', (req, res, next) => {
  res.clearCookie("edubot-cookie");
  res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;
