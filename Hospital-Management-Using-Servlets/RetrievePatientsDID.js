const express = require('express');
const app = express();

app.get('/RetrievePatientsDID', async (req, res) => {
  const connection = await getConnection();
  const did = req.query.did;
  const sql = `SELECT patients, name FROM doctor WHERE did = ${did}`;

  try {
    const s = await connection.createStatement();
    const r = await s.executeQuery(sql);
    r.next();
    const pList = r.getString('patients').split(',');
    const name = r.getString('name');
    const rrr = await s.executeQuery('SELECT * FROM patient');
    const rms = rrr.getMetaData();
    res.set('Content-Type', 'text/html');
    res.write(`
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
      </style>
      <h2>List of all the Patients working under: ${name}</h2>
      <table>
        <tr>
          <th>${rms.getColumnName(1)}</th>
          <th>${rms.getColumnName(2)}</th>
          <th>${rms.getColumnName(3)}</th>
          <th>${rms.getColumnName(4)}</th>
          <th>${rms.getColumnName(5)}</th>
          <th>${rms.getColumnName(6)}</th>
          <th>${rms.getColumnName(7)}</th>
          <th>${rms.getColumnName(8)}</th>
          <th>${rms.getColumnName(9)}</th>
          <th>${rms.getColumnName(10)}</th>
          <th>${rms.getColumnName(11)}</th>
        </tr>
    `);
    
    for (const p of pList.filter((p) => parseInt(p) >= 0)) {
      const ss = await connection.createStatement();
      const rr = await ss.executeQuery(`SELECT * FROM patient WHERE pid = ${p}`);
      rr.next();
      res.write(`
        <tr>
          <td>${rr.getString(1)}</td>
          <td>${rr.getString(2)}</td>
          <td>${rr.getString(3)}</td>
          <td>${rr.getString(4)}</td>
          <td>${rr.getString(5)}</td>
          <td>${rr.getString(6)}</td>
          <td>${rr.getString(7)}</td>
          <td>${rr.getString(8)}</td>
          <td>${rr.getString(9)}</td>
          <td>${rr.getString(10)}</td>
          <td>${rr.getString(11)}</td>
        </tr>
      `);
    }
    
    res.write(`</table>`);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  } finally {
    connection.close();
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
