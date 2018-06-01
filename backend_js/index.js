const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'g1727114_u',
  host: 'db.doc.ic.ac.uk',
  database: 'g1727114_u',
  password: 'nNrnFYebmJ',
  port: 5432,
  ssl: true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/high_score', (req, res, next) => {
  const value = req.body;

  pool.query("insert into high_score values ($1, $2, $3);", [value.uname, value.level, value.score])
  .then(db_res => {
    res.send(200);
    console.log("200 status code sent");
  })
  .catch(e => next(e));
});

app.get('/', (req, res, next) => {
  res.send('You reached the home page');
});

app.get('/high_score', (req, res, next) => {
  pool.query("select * from high_score", [])
  .then(db_res => {
    res.send(db_res.rows);
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
