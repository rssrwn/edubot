const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs_util = require('./models/handlebars_utils.js');
const PORT = process.env.PORT || 3000;

const app = express();

// Configure app
app.engine('handlebars', exphbs({
  partialsDir:'./public/partials',
  helpers: {
    for: hbs_util.forFunction
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './public');

// Third-party middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Our middleware (top executed first)
app.use(require('./middlewares/res_header'));
app.use('/teacher', require('./middlewares/teacher_auth'));
app.use('/student', require('./middlewares/student_auth'));
app.use('/shared', require('./middlewares/shared_auth'));
app.use(require('./controllers'));

// Listen on port
app.listen(PORT, () => {
  console.log(`EduBot is running on port ${ PORT }`);
});
