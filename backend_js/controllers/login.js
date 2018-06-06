const express = require('express');
const fs = require('fs');
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

  db.attemptLogin(body.uname, body.pass)
  .then(success => {
    if (success) {
      // Student login
      if (type === db.userTypeEnum.STUDENT) {
        res.cookie('edubot-cookie', 'student');
        res.sendStatus(250);

      // Teacher login
      } else if (type === db.userTypeEnum.TEACHER) {
        res.cookie('edubot-cookie', 'teacher');
        res.sendStatus(251);
      }
      return;

    } else {
      res.status(401).send("Failed login");
    }
  })
  .catch(err => next(err));

});

/*router.get('/', (req, res, next) => {
  res.sendFile(__dirname + './login.html');
});*/


module.exports = router;
