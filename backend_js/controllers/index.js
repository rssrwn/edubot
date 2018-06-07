const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/teacher', require('./teacher'));
router.use('/student', require('./student'));
router.use('/shared', require('./shared'));

router.get('/test', function(req, res) {
  // Comments.all(function(err, comments) {
  //   res.render('index', {comments: comments})
  // })
  getClasses("teacher2");
  getMembers(1);
});

module.exports = router;
