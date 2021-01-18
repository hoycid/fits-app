const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "fits_database",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const title = req.body.title;
  const quantity = req.body.quantity;
  const type = req.body.type;
  const commodity = req.body.commodity;
  const producer = req.body.producer;
  const year = req.body.year;

  const sqlInsert =
    "INSERT INTO materials (title, quantity, type, commodity, producer, year) VALUES (?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [title, quantity, type, commodity, producer, year],
    (err, result) => {
      res.send(result);
      err ? console.log(err) : "";
    }
  );
});

app.post("/log", (req, res) => {
  const data = req.body;
  console.log(`Action: ${data.title}`)
  const sqlInsert =
    "INSERT INTO changelog (action, title, quantity, date) VALUES (?,?,?,?)";
  
  db.query(
    sqlInsert,
    [data.action, data.title, data.quantity, data.date],
    (err, result) => {
      res.send(result);
      err ? console.log(err) : "";
    }
  );
});

app.get("/commodities", (req, res) => {
  const sqlSelect = "SELECT * FROM commodities";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
    err ? console.log(err) : "";
  });
});

app.put("/checkout", (req, res) => {
  const cart = req.body;
  const sqlUpdate = "UPDATE materials SET quantity = ? WHERE id = ?";
  var queryResult = ""

  cart.map((material) => {
    db.query(sqlUpdate, [material.quantity, material.id], (err, result) => {
      err ? console.log(err) : queryResult = result;
    });
  });
  res.send(queryResult)
});

app.get("/:keyword", (req, res) => {
  const keyword = req.body.keyword;
  const sqlSelect = "SELECT * FROM materials";
  const sqlSearch = `SELECT * FROM materials WHERE title LIKE %${keyword}%`;

  keyword
    ? db.query(sqlSearch, (err, result) => {
        res.send(result);
        err ? console.log(err) : "";
      })
    : db.query(sqlSelect, (err, result) => {
        res.send(result);
        err ? console.log(err) : "";
      });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sqlSelect = "SELECT * FROM materials WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    res.send(result[0]);
    err ? console.log(err) : "";
  });
});

app.put("/:id", (req, res) => {
  const title = req.body.title;
  const quantity = req.body.quantity;
  const type = req.body.type;
  const commodity = req.body.commodity;
  const producer = req.body.producer;
  const year = req.body.year;
  const id = req.params.id;

  const sqlUpdate =
    "UPDATE materials SET title = ?, quantity = ?, type = ?, commodity = ?, producer = ?, year = ? WHERE id = ?";
  db.query(
    sqlUpdate,
    [title, quantity, type, commodity, producer, year, id],
    (err, result) => {
      res.send(result);
      err ? console.log(err) : "";
    }
  );
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM materials WHERE id = ?";
  db.query(sqlDelete, [id], (err, result) => {
    res.send(result);
    err ? console.log(err) : "";
  });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
