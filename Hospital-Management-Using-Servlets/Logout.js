const { Connection, PreparedStatement } = require('mysql2/promise');

// function to get database connection
async function getDBConnection() {
    const connection = await Connection.getConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'hospital'
    });
    return connection;
}

// Login endpoint
async function handleLogin(req, res) {
    try {
        const email = req.body.email;
        const pwd = req.body.pwd;
        const connection = await getDBConnection();

        const checkUserSql = 'SELECT * FROM assistant WHERE email = ?';
        const [rows, fields] = await connection.execute(checkUserSql, [email]);
        if(rows.length && rows[0].password === pwd){
            const session = req.session;
            session.name = rows[0].name;
            session.aid = rows[0].aid;
            res.redirect('/welcome.html');
        } else {
            res.write("<br><br><br><h1 align=center><font color=\"red\">TRY AGAIN<br>REDIRECTING YOU TO LOGING PAGE</font></h1><script type=\"text/javascript\">");  
            res.write("redirectURL = \"login.html\";setTimeout(\"location.href = redirectURL;\",\"5000\");");  
            res.write("</script>");
            res.end();
        }

    } catch (error) {
        res.status(500).send('An error occurred');
        console.log(error);
    }
}

module.exports = {
    handleLogin
};
