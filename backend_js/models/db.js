const bcrypt = require('bcrypt');
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'g1727114_u',
  host: 'db.doc.ic.ac.uk',
  database: 'g1727114_u',
  password: 'nNrnFYebmJ',
  port: 5432,
  ssl: true
});

function hashPass(pass) {
  let hash = bcrypt.hashSync(pass, 10);
  return hash;
}

function compareHash(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

// Returns true is the given username is free
exports.unameFree = function(uname) {
  return new Promise(function(resolve, reject) {
    pool.query("select * from users where uname=$1;", [uname])
    .then(db_res => {
      if (db_res.rows.length !== 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
    .catch(e => reject(e));
  });
}

// Inserts user with required params into db
exports.insertUser = function(params) {
  return new Promise(function(resolve, reject) {
    const hash = hashPass(params.pass);
    pool.query("insert into users values ($1, $2, $3, $4, $5, $6);",
      [params.uname, hash, params.fname, params.lname, params.age, params.sch_id])
    .then(db_res => {
      resolve(true);
    })
    .catch(e => reject(e));
  });
}

// Returns true for successfull login, false otherwise
exports.attemptLogin = function(uname, pass) {
  return new Promise(function(resolve, reject) {
    pool.query("select users.uname, users.hash from users where uname=$1", [uname])
    .then(db_res => {
      if (db_res.rows.length !== 0 && compareHash(pass, db_res.rows[0].hash)) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(e => reject(e));
  });
}