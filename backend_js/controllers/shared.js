const express = require('express');
const router = express.Router();
const db = require('../models/db.js');

router.get('/level_intro', (req, res, next) => {

});

router.get('/play', (req, res, next) => {
  res.render('play', {});
});

module.exports = router;
