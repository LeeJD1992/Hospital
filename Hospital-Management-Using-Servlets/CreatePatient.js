const express = require('express');
const mysql = require('mysql');
const querystring = require('querystring');
const moment = require('moment');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to database');
    return;
  }
  console.log('Connection to database successful');
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/createPatient', (req, res) => {
  const { name, email, phone, age, gender, blood, symptom, disease, doctor } = req.body;
  const visited = moment().format('YYYY-MM-DD');
  const sql = 'INSERT INTO patient (name,email,phone,age,gender,blood,visited,symptom,disease,doctor) VALUES (?,?,?,?,?,?,?,?,?,?)';
  connection.query(sql, [name, email, phone, parseInt(age), gender, blood, visited, symptom, disease, parseInt(doctor)], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('<h1>Server Error</h1>');
      return;
    }
    const { insertId } = result;
    const sql1 = `SELECT patients FROM doctor WHERE did=${parseInt(doctor)}`;
    connection.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('<h1>Server Error</h1>');
        return;
      }
      const { patients } = result[0];
      const newPat = `${patients},${insertId}`;
      const sql2 = 'UPDATE doctor SET patients = ? WHERE did = ?';
      connection.query(sql2, [newPat, parseInt(doctor)], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send('<h1>Server Error</h1>');
          return;
        }
        res.status(200).send('<h1>SUCCESSFUL</h1>');
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
