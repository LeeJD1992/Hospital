const mysql = require('mysql');

let connection;

function getConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'hospital'
    });
  }
  return connection;
}

module.exports = { getConnection };
