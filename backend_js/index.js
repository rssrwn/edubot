const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool, Client } = require('pg');
const PORT = process.env.PORT || 3000;

const app = express();

const pool = new Pool({
  user: 'g1727114_u',
  host: 'db.doc.ic.ac.uk',
  database: 'g1727114_u',
  password: 'nNrnFYebmJ',
  port: 5432,
  ssl: true
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function hashPass(pass) {
  let hash = bcrypt.hashSync(pass, 10);
  return hash;
}

function compareHash(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

app.post('/high_score', (req, res, next) => {
  const body = req.body;

  pool.query("select * from high_score where uname=$1;", [body.uname])
  .then(db_res => {
    //console.log(db_res.rows);
    //res.sendStatus(200);
    if (db_res.rows !== []) {
      res.status(400).send("Username already exists");
    }
  })
  .catch(e => {
    console.log(error); // debugging
    next(e);
  });

  /*pool.query("insert into high_score values ($1, $2, $3);", [body.uname, body.level, body.score])
  .then(db_res => {
    console.log(db_res);
    res.sendStatus(200);
    console.log("200 status code sent");
  })
  .catch(e => next(e));*/
});

app.post('/signup', (req, res, next) => {
  const body = req.body;

  pool.query("select * from users where uname=$1;", [body.uname])
  .then(db_res => {
    if (db_res.rows.length !== 0) {
      res.status(400).send("Username already exists");
    } else {
      const hash = hashPass(body.pass);
      pool.query("insert into users values ($1, $2, $3, $4, $5, $6);",
        [body.uname, hash, body.fname, body.lname, body.age, body.sch_id])
      .then(db_res => {
        res.sendStatus(200);
      })
      .catch(e => next(e));
    }
  })
  .catch(e => next(e));
});

app.post('/login', (req, res, next) => {
  const body = req.body;

  pool.query("select users.uname, users.hash from users where uname=$1", [body.uname])
  .then(db_res => {
    //console.log(db_res.rows[0].hash);
    console.log(db_res.rows);
    if (compareHash(body.pass, db_res.rows[0].hash)) {
      console.log("success");
      res.sendStatus(200);
    } else {
      res.status(401).send("Failed login");
    }
  })
  .catch(e => next(e));
});

app.get('/', (req, res, next) => {
  res.send('You reached the home page');
});

app.get('/high_score', (req, res, next) => {
  pool.query("select * from high_score", [])
  .then(db_res => {
    res.json(db_res.rows);
    console.log(db_res.rows);
  })
  .catch(e => next(e));
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});

/*
app.get('/', function (req, res, next) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      // pass the error to the express error handler
      return next(err)
    }
    client.query('SELECT * from users', [], function (err, result) {
      done()

      if (err) {
        // pass the error to the express error handler
        return next(err)
      }

      res.json(result.rows)
    })
  })
})

const users = []

app.post('/users', function (req, res) {
    // retrieve user posted data from the body
    const user = req.body
    users.push({
      name: user.name,
      age: user.age
    })
    res.send('successfully registered')
})
*/
