const http = require('http');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql');
const querystring = require('querystring');
const moment = require('moment');

const hostname = '127.0.0.1';
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

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  if (req.method === 'GET') {
    if (pathName === '/') {
      fs.readFile('index.html', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.write('404 Not Found');
          return res.end();
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
      });
    }
  } else if (req.method === 'POST') {
    if (pathName === '/createPatient') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { name, email, phone, age, gender, blood, symptom, disease, doctor } = querystring.parse(body);
        const visited = moment().format('YYYY-MM-DD');
        const sql = 'INSERT INTO patient (name,email,phone,age,gender,blood,visited,symptom,disease,doctor) VALUES (?,?,?,?,?,?,?,?,?,?)';
        connection.query(sql, [name, email, phone, parseInt(age), gender, blood, visited, symptom, disease, parseInt(doctor)], (err, result) => {
          if (err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.write('<h1>Server Error</h1>');
            return res.end();
          }
          const { insertId } = result;
          const sql1 = `SELECT patients FROM doctor WHERE did=${parseInt(doctor)}`;
          connection.query(sql1, (err, result) => {
            if (err) {
              console.log(err);
              res.writeHead(500, { 'Content-Type': 'text/html' });
              res.write('<h1>Server Error</h1>');
              return res.end();
            }
            const { patients } = result[0];
            const newPat = `${patients},${insertId}`;
            const sql2 = 'UPDATE doctor SET patients = ? WHERE did = ?';
            connection.query(sql2, [newPat, parseInt(doctor)], (err, result) => {
              if (err) {
                console.log(err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write('<h1>Server Error</h1>');
                return res.end();
              }
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.write('<h1>SUCCESSFUL</h1>');
              return res.end();
            });
          });
        });
      });
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
