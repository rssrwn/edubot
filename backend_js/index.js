const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
//const db = require('./models/db.js');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(require('./controllers'));

//app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});

/*
app.post('/signup', (req, res, next) => {
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

app.post('/login', (req, res, next) => {
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
*/

/*
app.get('/', (req, res, next) => {
  //res.send('You reached the home page');
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/high_score', (req, res, next) => {
  pool.query("select * from high_score", [])
  .then(db_res => {
    res.json(db_res.rows);
    console.log(db_res.rows);
  })
  .catch(e => next(e));
});
*/
