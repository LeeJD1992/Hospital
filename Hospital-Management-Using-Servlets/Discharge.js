const express = require('express');
const mysql = require('mysql');

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

const app = express();

app.use(express.json());

app.post('/Discharge', (req, res) => {
  const { pid, days, daycost, mc } = req.body;
  const mcs = mc.split(';');

  connection.beginTransaction((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('<h1>Server Error</h1>');
    }

    const sq1 = `DELETE FROM patient WHERE pid = ${pid}`;

    connection.query(sq1, (err) => {
      if (err) {
        connection.rollback(() => {
          console.log(err);
          res.status(500).send('<h1>Server Error</h1>');
        });
      }

      let total = 0;

      for (const mc of mcs) {
        const mid = mc.split(',')[0];
        const count = parseInt(mc.split(',')[1]);

        const sq2 = `SELECT price FROM medicine WHERE mid = ${mid}`;

        connection.query(sq2, (err, results) => {
          if (err) {
            connection.rollback(() => {
              console.log(err);
              res.status(500).send('<h1>Server Error</h1>');
            });
          }

          const price = parseFloat(results[0].price);
          total += price * count;

          if (mcs.indexOf(mc) === mcs.length - 1) {
            total += days * daycost;

            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  console.log(err);
                  res.status(500).send('<h1>Server Error</h1>');
                });
              }

              res.status(200).send(`<h1>TOTAL MONEY TO PAY IS:<br><br><br></h1><h3>= ${total}</h3>`);
            });
          }
        });
      }
    });
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
