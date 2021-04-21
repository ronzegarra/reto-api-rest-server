/*const path = require("path");

const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
*/

const path = require("path");

const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
var app = express();
const port = process.env.PORT || 3000;
//Configuring express server

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.use(bodyparser.json());


/*const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});*/

//MySQL details

var mysqlConnection = mysql.createConnection({
  host: "us-cdbr-east-03.cleardb.com",
  user: "b5063a6dbe3597",
  password: "53b4c1f0",
  database: "heroku_0ee0569291a560f",
  port: 3306,
  multipleStatements: true,
});



let handleConnection =() => {
  mysqlConnection.connect((err) => {
    if (!err) console.log("Connection Established Successfully");
    else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
  }); 
}

handleConnection();
//Creating GET Router to fetch all the learner details from the MySQL Database
app.get("/clients", (req, res) => {
  mysqlConnection.query("SELECT * FROM client", (err, rows, fields) => {

    console.log('ESTAS LLAMANDO')
    
    if (!err) res.send(rows);
    else {
      handleConnection();
      console.log(err);
    }
  });
});

//Router to GET specific learner detail from the MySQL database

/*SELECT STDDEV(total_cost)             
FROM purchase;*/

app.get("/kpideclientes", (req, res) => {
  mysqlConnection.query(
    "SELECT AVG(course_Id) AS avg_age, STDDEV(course_Id) AS std_age  FROM learnerdetails",
    (err, rows, fields) => {
      if (!err) {
        console.log("ROWS----->>>", rows);

        res.send(rows);
      } else console.log(err);
    }
  );
});

//Router to INSERT/POST a learner's detail
app.post("/learners", (req, res) => {
  let learner = req.body;

  console.log("LEARNER", req.body);

  var sql =
    "SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_Id = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_Id);";
  mysqlConnection.query(
    sql,
    [
      learner.learner_id,
      learner.learner_name,
      learner.learner_email,
      learner.course_Id,
    ],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
            res.send("New Learner ID : " + element[0].learner_id);
        });
      else console.log(err);
    }
  );
});

/*
const publicPath = path.join(__dirname, 'build');

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
*/
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
