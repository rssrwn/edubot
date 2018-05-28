var express = require("express");
var pg = require("pg");
var app = express();

var connectionString = "postgres://g1727114_u:nNrnFYebmJ@db.doc.ic.ac.uk:5432/g1727114_u";

var pgClient = new pg.Client(connectionString);

pgClient.connect();

var query = pgClient.query("select * from users");

query.on("row", function(row, result) {
  result.add(row);
  document.write(result);
});

query.on("end", function(result) {
  pgClient.end();
});

document.write(result);






