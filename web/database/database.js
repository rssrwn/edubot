var express = require("express");
var pg = require("pg");
var app = express();

var connectionString = "postgres://g1727114_u:nNrnFYebmJ@db.doc.ic.ac.uk:5432/g1727114_u";

/*
app.get('/', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM student', [1],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});
 
app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
}); 

*/

app.get('/', function (req, res) {
  res.send('hello world')
});

pg.connect(connectionString,function(err,client,done) {
   if(err){
       console.log("not able to get connection "+ err);
       res.status(400).send(err);
   } 
   client.query('SELECT * FROM student', [1], function(err,result) {
       done(); // closing the connection;
       if(err){
           console.log(err);
           res.status(400).send(err);
       }
       res.status(200).send(result.rows);
   });
});