const http = require('http');
const mysql = require('mysql');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const { spawn } = require('child_process');
const dateFormat = require('dateformat');
const port = 3000;

// MySQL DB Connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "hospital"
});

// Creating server
const server = http.createServer(function (req, res) {
    if (req.url === '/CreateAssistant' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email, phone, pwd } = querystring.parse(body);

            const joindate = dateFormat(new Date(), "yyyy-mm-dd");

            const sql = "INSERT INTO assistant(name,email,phone,joindate,password) VALUES(?,?,?,?,?)";
            const values = [name, email, phone, joindate, pwd];

            // Executing SQL
            con.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err);
                    res.setHeader('Content-Type', 'text/html');
                    res.write("<br><br><br><h1 align=center><font color=\"red\">TRY AGAIN<br>REDIRECTING BACK REGISTERATION PAGE</font></h1><script type=\"text/javascript\">");
                    res.write("redirectURL = \"newAssistant.html\";setTimeout(\"location.href = redirectURL;\",\"5000\");");
                    res.write("</script>");
                    return res.end();
                }
                res.writeHead(302, { 'Location': 'login.html' });
                return res.end();
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        fs.createReadStream(__dirname + '/404.html').pipe(res);
    }
});

// Server Listening
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
