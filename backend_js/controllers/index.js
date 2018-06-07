const express = require('express');
const db = require('../models/db.js');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', async function(req, res) {
  //db.insertClass('Year 8A', 1, 'teacher2');
  //db.addMember('ryan06', 1);
  var info = await db.getClassName(1);
  console.log(info);
  res.sendStatus(200);
});

module.exports = router;
