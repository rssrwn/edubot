const express = require('express');
const db = require('../models/db.js');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', async function(req, res) {
  res.sendStatus(200);
});

module.exports = router;
