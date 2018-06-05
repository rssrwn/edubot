const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('views', './views');
app.set('view engine', 'handlebars');

// Third-party middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/shared', express.static(path.join(__dirname, 'public/shared'))); // Do something better here
//app.use('/student', express.static(path.join(__dirname, 'public/student')));
//app.use('/teacher', express.static(path.join(__dirname, 'public/teacher')));

// Our middleware (top executed first)
app.use(require('./middlewares/res_header'));
//app.use('/teacher', require('./middlewares/teacher_auth'));
//app.use('/student', require('./middlewares/student_auth'));
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
