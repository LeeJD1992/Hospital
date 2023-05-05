const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

router.post('/CreateDoctor', async (req, res) => {
    try {
        const con = await getConnection();
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const age = req.body.age;
        const joindate = new Date().toISOString().slice(0, 10);
        const sal = req.body.sal;
        const spec = req.body.spec;
        const patients = "-1";
        const sql = "insert into doctor(name,email,phone,age,joindate,salary,specialist,patients) values(?,?,?,?,?,?,?,?)";
        const params = [name, email, phone, age, joindate, sal, spec, patients];
        const [result] = await con.execute(sql, params);
        
        if (result.affectedRows === 1) {
            res.status(200).send("<br><br><br><h1 align=center><font color=\"green\">SUCCESSFUL<br></font></h1><script type=\"text/javascript\"></script>");
        } else {
            res.status(500).send("<br><br><br><h1 align=center><font color=\"red\">THERE IS SOME PROBLEM<br></font></h1><script type=\"text/javascript\"></script>");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
