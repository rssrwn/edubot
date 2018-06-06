const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../models/db.js');

router.post('/', (req, res, next) => {
  const body = req.body;

  db.unameFree(body.uname)
  .then(free => {
    if (free) {
      db.insertUser(body)
      .catch(e => next(e));

      res.sendStatus(200);
      return;
    }
    res.status(400).send("Username already exists");
  })
  .catch(e => next(e));
});

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + './../public/signup.html'));
});

module.exports = router;
