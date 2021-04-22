const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connection;
//Manage Connection
function handleDisconnect() {
  var db_config = {
    host: "us-cdbr-east-03.cleardb.com",
    user: "b5063a6dbe3597",
    password: "53b4c1f0",
    database: "heroku_0ee0569291a560f",
    port: 3306,
    multipleStatements: true,
  };

  connection = mysql.createConnection(db_config);
  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

//To Get Data from Clients
app.get("/clients", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  connection.query("SELECT * FROM client", (err, rows, fields) => {
    console.log("ESTAS LLAMANDO");

    if (!err) res.send(rows);
    else console.log(err);
  });
});

//To Get Math Data from Clients
app.get("/kpideclientes", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  connection.query(
    "SELECT AVG(age) AS avg_age, STDDEV(age) AS std_age  FROM client",
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else console.log(err);
    }
  );
});

//Router to INSERT/POST a client
app.post("/creacliente", (req, res) => {
  let client = req.body;

  console.log("CLIENT", req.body);

  var sql =
    "SET @name = ?;SET @last_name = ?;SET @age = ?;SET @date_birth = ?; CALL clientAdd(@name,@last_name,@age,@date_birth);";
    connection.query(
    sql,
    [
      client.name,
      client.last_name,
      client.age,
      client.date_birth,
    ],
    (err, rows, fields) => {
      if (!err)
        res.json({response: "ok"});
      else console.log(err);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
