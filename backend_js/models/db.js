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

userTypeEnum = {
  NEITHER: 0,
  STUDENT: 1,
  TEACHER: 2,
};

function hashPass(pass) {
  let hash = bcrypt.hashSync(pass, 10);
  return hash;
}

function compareHash(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

// Get the type of the user with uname
exports.getUserType = async function(uname) {
  var free = await exports.unameFree(uname);
  if (free) {
    return userTypeEnum.NEITHER;
  }

  try {
    var db_res = await pool.query("select users.type from users where uname=$1;", [uname]);
    if (db_res.rows[0].type === 1) {
      return userTypeEnum.STUDENT;
    } else if (db_res.rows[0].type === 2) {
      return userTypeEnum.TEACHER;
    }
  } catch(e) {
    Promise.reject(e);
  }
}

// Returns true is the given username is free
exports.unameFree = async function(uname) {
  var db_res = await pool.query("select * from users where uname=$1;", [uname]);
  if (db_res.rows.length !== 0) {
    return false;
  } else {
    return true;
  }
}

// Returns an object with fields of user info (excluding pass and type)
exports.getUserInfo = async function(uname) {
  var db_res = await pool.query("select uname, fname, lname, age, sch_id from users where uname=$1;", [uname]);
  return db_res.rows[0];
}

// Inserts user with required params into db
exports.insertUser = async function(params) {
  const hash = hashPass(params.pass);
  var db_res = await pool.query("insert into users values ($1, $2, $3, $4, $5, $6, $7);",
      [params.uname, hash, params.fname, params.lname, params.type,
      params.age, params.sch_id])
  return true;
}

// Returns true for successfull login, false otherwise
exports.attemptLogin = async function(uname, pass) {
  var db_res = await pool.query("select users.uname, users.hash from users where uname=$1;", [uname]);
  if (db_res.rows.length !== 0 && compareHash(pass, db_res.rows[0].hash)) {
    return true;
  } else {
    return false;
  }
}

// Insert class into db with given name, school_id and teacher username and returns the class_id of the new class
exports.insertClass = async function(name, school_id, teacher) {
  var type = await exports.getUserType(teacher);
  if (type !== userTypeEnum.TEACHER) {
    return -1;
  }

  var db_res = await pool.query("select MAX(class_id) from class;");
  var max = db_res.rows[0].max;
  await pool.query("insert into class values ($1, $2, $3, $4);", [school_id, max+1, name, teacher]);
  return max+1;
}

// Add a member with given uname into class with class_id
exports.addMember = async function(uname, class_id) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let member = await inClass(uname);
  if (member) {
    return -2;
  }

  await pool.query("insert into student_class values ($1, $2);", [uname, class_id]);
  return 1;
}

// Find whether uname is already in a class
inClass = async function(uname) {
  let db_res = await pool.query("select uname from student_class;");
  res = false;
  for (var i=0; i<db_res.rows.length; i++) {
    console.log(db_res.rows[i].uname);
    if (db_res.rows[i].uname == uname) {
      res = true;
    }
  }
  return res;
}

// Get a class name from a class_id
exports.getClassName = async function(class_id) {
  var db_res = await pool.query("select name from class where class_id=$1;", [class_id]);
  return db_res.rows[0].name;
}

// Get an array of class_ids for teacher with uname teacher
exports.getClasses = async function(teacher) {
  var res = await pool.query("select class_id from class where teacher=$1;", [teacher]);
  ret = [];
  for (var i=0; i<res.rows.length; i++) {
    ret[i] = res.rows[i].class_id;
  }
  return ret;
}

// Get a list of students (usernames') who are members of class_id
exports.getMembers = async function(class_id) {
  let res = await pool.query("select uname from student_class where class_id=$1;", [class_id]);
  ret = [];
  for (var i=0; i<res.rows.length; i++) {
    ret[i] = res.rows[i].uname;
  }
  return ret;
}

// Get the sch_id for a teacher uname
exports.getSchId = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let db_res = await pool.query("select sch_id from users where uname=$1;", [uname]);
  return db_res.rows[0].sch_id;
}

// Get a list of uname's results from all levels
exports.getLevelResults = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let db_res = await pool.query("select level_id, score from student_level where uname=$1;", [uname]);

  ret = [];
  for (var i=0; i<db_res.rows.length; i++) {
    ret[i] = db_res.rows[i].score;
  }
  return ret;
}

// Sets result of level to the largest of score and the current score
exports.setResult = async function(uname, level, score) {
  let type = await exports.getUserType(uname);
  if (type !== userTypeEnum.STUDENT) {
    return -1;
  }

  let res = await pool.query("select level_id from level where link=$1;", [level]);
  let level_id = res.rows[0].level_id;

  db_res = await pool.query("select score from student_level where uname=$1 and level_id=$2;", [uname, level_id]);
  if (db_res.rows.length > 0) {
    curr = db_res.rows[0].score;
    if (score > curr) {
      await pool.query("update student_level set score=$1 where uname=$2 and level_id=$3;", [score, uname, level_id]);
    } else {
      return 1;
    }
  } else {
    await insertScore(uname, level_id, score);
  }

  return 0;
}

// Insert a score
insertScore = async function(uname, level_id, score) {
  try {
    await pool.query("insert into student_level values($1, $2, $3);", [uname, level_id, score]);
  } catch(e) {
    Promise.reject(e);
  }
}

// Gets the level that uname has currently not played
exports.getCurrLevel = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let db_res = await pool.query("select max(level_id) from student_level where uname=$1;", [uname]);
  return db_res.rows[0].max + 1;
}

exports.userTypeEnum = userTypeEnum;
