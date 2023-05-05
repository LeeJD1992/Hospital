const http = require('http');
const url = require('url');
const querystring = require('querystring');
const mysql = require('mysql');

const server = http.createServer((req, res) => {
// Set CORS headers to allow cross-domain requests from anywhere
res.setHeader('Access-Control-Allow-Origin', '');
res.setHeader('Access-Control-Request-Method', '');
res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
res.setHeader('Access-Control-Allow-Headers', '*');

if (req.method === 'OPTIONS') {
res.writeHead(200);
res.end();
return;
}

if (req.method === 'POST') {
let body = '';
req.on('data', chunk => {
body += chunk.toString();
});
req.on('end', () => {
const data = querystring.parse(body);
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'password',
database: 'medicine'
});
connection.connect((err) => {
if (err) throw err;
console.log('Connected!');
const sql = 'INSERT INTO medicine(name, price, count) VALUES (?, ?, ?)';
const values = [data.name, data.price, data.count];
connection.query(sql, values, (err, result) => {
if (err) {
console.error(err);
res.writeHead(500, {'Content-Type': 'text/plain'});
res.end('Error: ' + err);
return;
}
console.log(result.affectedRows + ' row(s) inserted');
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('SUCCESSFUL');
});
});
});
}
});

server.listen(8080, () => {
console.log('Server listening on port 8080');
});
