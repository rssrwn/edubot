const express = require('express');
const fs = require('fs');
const router = express.Router();
const db = require('../models/db.js');

router.post('/', (req, res, next) => {
  const body = req.body;
  type = db.userTypeEnum.NEITHER;
  db.getUserType(uname)
  .then(res => {
    type = res;
  })
  .catch(err => next(err));

  db.attemptLogin(body.uname, body.pass)
  .then(success => {
    if (success) {
      if (type === userTypeEnum.STUDENT) {
        res.cookie('edubot-cookie', 'student');
      } else if (type === userTypeEnum.TEACHER) {
        res.cookie('edubot-cookie', 'teacher');
      }

      res.sendStatus(200);
      return;
    }
    res.status(401).send("Failed login");
  })
  .catch(err => next(err));
});

/*router.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/../login.html');
});*/


module.exports = router;
