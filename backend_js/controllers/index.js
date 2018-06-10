const express = require('express');
const path = require('path');
const db = require('../models/db.js');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', async function(req, res, next) {
  //var info = await db.insertClass('Year 8C', 1, 'teacher2');
  //var info = await db.addMember('ryan06', 1);
  //var info = await db.getClassName(1);
  let info = await db.getLevelResults('user2');
  console.log(info);
  res.sendStatus(200);
});

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + './../public/login.html'));
});

module.exports = router;
