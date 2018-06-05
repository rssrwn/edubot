const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

// Third-party middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Our middleware (top executed first)
app.use(require('./middlewares/res_header'));
app.use('/teacher', require('./middlewares/auth'));
app.use(require('./controllers'));

// Listen on port
app.listen(PORT, () => {
  console.log(`EduBot is running on port ${ PORT }`);
});

/*
app.get('/high_score', (req, res, next) => {
  pool.query("select * from high_score", [])
  .then(db_res => {
    res.json(db_res.rows);
    console.log(db_res.rows);
  })
  .catch(e => next(e));
});
*/
