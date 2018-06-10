const express = require('express');
const db = require('../models/db.js');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', async function(req, res) {
  //var info = await db.insertClass('Year 8C', 1, 'teacher2');
  //var info = await db.addMember('ryan06', 1);
  //var info = await db.getClassName(1);
  let info = await db.getLevelResults('user2');
  console.log(info);
  res.sendStatus(200);
});

module.exports = router;
