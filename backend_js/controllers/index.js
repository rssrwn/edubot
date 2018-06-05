const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/signup', require('./signup'));

/*router.get('/', function(req, res) {
  Comments.all(function(err, comments) {
    res.render('index', {comments: comments})
  })
})*/

module.exports = router;
