const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.post('/', (req, res, next) => {
  const body = req.body;

  db.attemptLogin(body.uname, body.pass)
  .then(success => {
    if (success) {
      res.sendStatus(200);
      return;
    }
    res.status(401).send("Failed login");
  })
  .catch(err => next(err));
});

router.get('/', (req, res, next) => {
  //res.send('you reached login');
  //res.render('index');
  res.sendFile('index.html');
});

module.exports = router;
