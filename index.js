var express = require('express');
var app = express();

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// Default Route
app.get('/', function (req, res) {
     res.send('<h1>Hello World</h1>');
  })
  

// Connect MySQL Database
// npm install mysql - MySQL Database client for nodes
var mysql = require('mysql');

// Create Connection to MySQL
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'mysql',
  database:'mru'
});

//GET Method - Student Data: http://localhost:8080/mysql/students
app.get("/mysql/students", function(req , res){

  connection.query("SELECT RollNo, Name FROM mru.student", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
  });

});

//GET Method - Student Data: http://localhost:8080/mysql/studentDetails?RollNo=2011CS010181
app.get("/mysql/studentDetails?", function(req, res){

  RollNo = req.query.RollNo;
  
  connection.query("SELECT RollNo, Name FROM mru.student where RollNo = '" + RollNo + "'", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//GET Method - Student Data: http://localhost:8080/mysql/studentDetails/2011CS010181
app.get("/mysql/studentDetails/:RollNo", function(req, res){

  RollNo = req.params.RollNo;
  
  connection.query("SELECT RollNo, Name FROM mru.student where RollNo = '" + RollNo + "'", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});


//Post Method - Student Data: http://localhost:8080/mysql/studentDetails
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post("/mysql/studentDetails", function(req, res){
  
  RollNo = req.body.RollNo;

  connection.query("SELECT RollNo, Name FROM mru.student where RollNo = '" + RollNo + "'", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//Post Method - Update Student Record: http://localhost:8080/mysql/UpdateStudent
app.post("/mysql/UpdateStudent", function(req, res){
  
  RollNo = req.body.RollNo;
  AssignmentStatus = req.body.AssignmentStatus;

  res.send(req.body);
  return;
  
  connection.query("Update mru.student set AssignmentStatus = '" + AssignmentStatus + "' where RollNo = '" + RollNo + "'", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//Post Method - Insert New Student Record: http://localhost:8080/mysql/InsertStudent
app.post("/mysql/InsertStudent", function(req, res){
  
  RollNo = req.body.RollNo;
  Name = req.body.Name;

  connection.query("Insert into mru.Student (RollNo, Name) values ('" + RollNo + "', '" + Name + "')", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//Post Method - Delete Student Record: http://localhost:8080/mysql/DeleteStudent
app.post("/mysql/DeleteStudent", function(req, res){
  
  RollNo = req.body.RollNo;

  connection.query("Delete from mru.student where RollNo = '" + RollNo + "'", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//Post Method - Get Student List using Stored Procedure: http://localhost:8080/mysql/GetStudentList
app.post("/mysql/GetStudentList", function(req, res){
  
  connection.query("call GetStudents", function (err, data) {
      if (err) return next(new AppError(err, 500));

      res.status(200).json({
        status: "success",
        length: data?.length, 
        data: data,
      });
  });

});

//Post Method - Get Student List using Stored Procedure with Parameter: http://localhost:8080/mysql/GetStudentList
app.post("/mysql/GetStudentDetails", function(req, res){
    RollNo = req.body.RollNo;

    connection.query("call GetStudentDetails('" + RollNo + "')", function (err, data) {
        if (err) return next(new AppError(err, 500));
  
        res.status(200).json({
          status: "success",
          length: data?.length, 
          data: data,
        });
    });
  
  });

//Connect to MS SQL Server
//npm install mssql - SQL Sever Database client for node
var sql = require("mssql");

var dbConfig = {
  user: "sa",
  password: "plSrikar99",
  server: "103.48.51.73",
  database: "mru",
  port: 1433,
  synchronize: true,
  trustServerCertificate: true,
};

//GET Student Data: http://localhost:8080/mssql/students
app.get("/mssql/students", function(req , res){
  var dbConn = new sql.ConnectionPool(dbConfig);

  dbConn.connect().then(function () {
      var request = new sql.Request(dbConn);
      
      request.query("select * from student" ).then(function (resp) {
          dbConn.close();

          res.status(200).json({
              status: "success",
              length: resp.recordset?.length,
              data: resp.recordset,
            });

      }).catch(function (err) {
          console.log(err);
          dbConn.close();
      });
  }).catch(function (err) {
      console.log("error " + err);
  });

})
