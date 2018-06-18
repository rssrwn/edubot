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




// <------------------------- Login and Singup ---------------------------->




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
  let free = await exports.unameFree(uname);
  if (free) {
    return null;
  }

  var db_res = await pool.query("select uname, fname, lname, age, sch_id, type, name as sch_name from users natural join school where uname=$1;", [uname]);
  //console.log(db_res.rows);
  if (db_res.rows[0].type === 1) {
    db_res.rows[0].type = 'Student';
  } else if (db_res.rows[0].type === 2) {
    db_res.rows[0].type = 'Teacher';
  }
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
  let db_res = await pool.query("select users.uname, users.hash from users where uname=$1;", [uname]);
  if (db_res.rows.length !== 0 && compareHash(pass, db_res.rows[0].hash)) {
    return true;
  } else {
    return false;
  }
}




// <----------------------- Class and school info -------------------------->




// Insert class into db with given name, school_id and teacher username and returns the class_id of the new class
exports.insertClass = async function(name, school_id, teacher) {
  let type = await exports.getUserType(teacher);
  if (type !== userTypeEnum.TEACHER) {
    return -1;
  }

  let db_res = await pool.query("select MAX(class_id) from class;");
  let max = db_res.rows[0].max;
  await pool.query("insert into class values ($1, $2, $3, $4);", [school_id, max+1, name, teacher]);
  return max+1;
}

// Remove a class with class_id and all members
exports.removeClass = async function(teacher, class_id) {
  let db_res = await pool.query("select * from class where class_id=$1 and teacher=$2;", [class_id, teacher]);
  if (!db_res.rows[0]) {
    return -1;
  }

  await removeAllMembers(class_id);

  let res = await pool.query("delete from class where class_id=$1;", [class_id]);
  return 0;
}

removeAllMembers = async function(class_id) {
  let res = await pool.query("delete from student_class where class_id=$1;", [class_id]);
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
  return 0;
}

// Remove a member from a class
exports.removeMember = async function(teacher, uname, class_id) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let member = await pool.query("select * from student_class where uname=$1 and class_id=$2;", [uname, class_id]);
  if (!member.rows[0]) {
    return -2;
  }

  let allowed = await pool.query("select * from class where class_id=$1 and teacher=$2;", [class_id, teacher]);
  if (!allowed.rows[0]) {
    return -3;
  }

  try {
    await pool.query("delete from student_class where uname=$1 and class_id=$2;", [uname, class_id]);
  } catch(e) {
    Promise.reject(e);
  }

  return 0;
}

// Find whether uname is already in a class
inClass = async function(uname) {
  let db_res = await pool.query("select uname from student_class;");
  res = false;
  for (var i=0; i<db_res.rows.length; i++) {
    if (db_res.rows[i].uname == uname) {
      res = true;
    }
  }
  return res;
}

// Get a class name from a class_id
exports.getClassName = async function(class_id) {
  let db_res = await pool.query("select name from class where class_id=$1;", [class_id]);
  return db_res.rows[0].name;
}

// Get an array of class_ids for teacher with uname teacher
exports.getClasses = async function(teacher) {
  let res = await pool.query("select class_id from class where teacher=$1;", [teacher]);
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




// <------------------------ Solutions ans results --------------------------->




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
exports.setResult = async function(uname, level, score, solution) {
  let type = await exports.getUserType(uname);
  if (type !== userTypeEnum.STUDENT) {
    return -1;
  }

  let level_id = await exports.getLevelId(level);

  db_res = await pool.query("select score from student_level where uname=$1 and level_id=$2;", [uname, level_id]);
  if (db_res.rows.length > 0) {
    curr = db_res.rows[0].score;
    if (score > curr) {
      await pool.query("update student_level set score=$1, solution=$2 where uname=$3 and level_id=$4;", [score, solution, uname, level_id]);
    } else {
      return 1;
    }
  } else {
    await insertSolution(uname, level_id, score, solution);
  }

  return 0;
}

// Get uname's solution on level
exports.getSolution = async function(uname, level) {
  let type = await exports.getUserType(uname);
  if (type !== userTypeEnum.STUDENT) {
    return null;
  }

  let levelId = await exports.getLevelId(level);
  let db_res = await pool.query("select solution from student_level where uname=$1 and level_id=$2;", [uname, levelId]);

  if (db_res.rows[0]) {
    return db_res.rows[0].solution;
  } else {
    return null;
  }
}

// Insert a score
insertSolution = async function(uname, level_id, score, solution) {
  try {
    await pool.query("insert into student_level values($1, $2, $3, $4);", [uname, level_id, score, solution]);
  } catch(e) {
    Promise.reject(e);
  }
}




// <-------------------------- Level Info ----------------------------------->




// Get an id for a level
exports.getLevelId = async function(level) {
  let res = await pool.query("select level_id from level where link=$1;", [level]);

  if (res.rows[0]) {
    return res.rows[0].level_id;
  } else {
    return null;
  }
}

// Gets the level that uname has currently not played
exports.getCurrLevel = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let type = await exports.getUserType(uname);
  if (type === userTypeEnum.TEACHER) {
    let db_res = await pool.query("select max(level_id) from level;", []);
    return db_res.rows[0].max;
  }

  let db_res = await pool.query("select max(level_id) from student_level where uname=$1;", [uname]);
  return db_res.rows[0].max + 1;
}

exports.getCurrLevelName = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let db_res = await pool.query('select link from level where level_id=(select max(level_id) from student_level where uname=$1)+1;', [uname]);
  return db_res.rows[0].link;
}

// Get an object containing a list of categories with levels within
exports.getAllLevels = async function(uname) {
  let db_res1 = await pool.query("select cat, cat_id, identifier from category;", []);
  let cats = db_res1.rows;
  cats.sort(function(a, b) {
    return a.cat_id > b.cat_id;
  });
  let currLevel = await exports.getCurrLevel(uname);

  for (var i=0; i<cats.length; i++) {
    let cat = cats[i];
    cat.categoryName = cat.cat;
    cat.conceptId = cat.identifier;
    delete cat.identifier;
    delete cat.cat;

    let db_res2 = await pool.query("select level_id as number, score as stars, name, link from (select level_id, score from student_level where uname=$1) as completed right outer join level using(level_id) left outer join level_cat using(level_id) where cat_id=$2;", [uname, cat.cat_id]);
    let levels = db_res2.rows;
    for (var j=0; j<levels.length; j++) {
      let level = levels[j];

      let feedback = await exports.getFeedback(uname, level.link);
      if (feedback !== null) {
        level.feedback = true;
      } else {
        level.feedback = false;
      }

      let link = '/shared/level_intro?levelId=' + level.link + '&studentId=' + uname;
      level.link = link;

      level.locked = true;
      if (level.number <= currLevel) {
        level.locked = false;
      }
    }

    delete cat.cat_id;
    cat.levels = levels;

    //console.log(cat);
  }

  return cats;
}




// <---------------------------- Feedback ---------------------------------->




// Get feedback for a student and level, null if none
exports.getFeedback = async function(uname, level) {
  let free = await exports.unameFree(uname);
  if (free) {
    return null;
  }

  let level_id = await exports.getLevelId(level);
  let db_res = await pool.query("select feedback from feedback where uname=$1 and level_id=$2;", [uname, level_id]);

  if (db_res.rows[0]) {
    if (db_res.rows[0].feedback !== '') {
      return db_res.rows[0].feedback;
    }
  }

  return null;
}

// Add feedback to db for uname and level
exports.addFeedback = async function(uname, level, teacher, feedback) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  if (feedback === '') {
    return -3;
  }

  // Check if teacher has permission
  let db_res1 = await pool.query("select * from class natural join student_class where uname=$1 and teacher=$2;", [uname, teacher]);
  if (!db_res1.rows[0]) {
    return -2;
  }

  let level_id = await exports.getLevelId(level);

  await pool.query("delete from feedback where uname=$1 and level_id=$2;", [uname, level_id]);
  await pool.query("insert into feedback values($1, $2, $3);", [uname, level_id, feedback]);
  return 0;
}

// Get all feedback in a list
exports.getAllFeedback = async function(uname) {
  let free = await exports.unameFree(uname);
  if (free) {
    return null;
  }

  let db_res = await pool.query("select level_id, feedback from feedback where uname=$1;", [uname]);

  if (!db_res.rows[0]) {
    return null;
  }

  let feedbacks = db_res.rows;

  ret = [];
  for (var i=0; i<feedbacks.length; i++) {
    let feedback = feedbacks[i];
    if (feedback.feedback !== '') {
      ret.push(feedback);
    }
  }

  return ret;
}




// <----------------------- Temporary solutions -------------------------->




exports.getTempSol = async function(uname, level) {
  let free = await exports.unameFree(uname);
  if (free) {
    return null;
  }

  let level_id = await exports.getLevelId(level);

  let db_res = await pool.query("select solution from temp_sol where uname=$1 and level_id=$2;", [uname, level_id]);
  if (db_res.rows[0]) {
    return db_res.rows[0].solution;
  } else {
    return null;
  }
}

exports.setTempSol = async function(uname, level, solution) {
  let free = await exports.unameFree(uname);
  if (free) {
    return -1;
  }

  let level_id = await exports.getLevelId(level);

  let db_res = await pool.query("insert into temp_sol values ($1, $2, $3) on conflict(uname, level_id) do update set solution=$3;", [uname, level_id, solution]);

  return 0;
}

exports.userTypeEnum = userTypeEnum;
