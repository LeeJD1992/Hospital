const { getConnection } = require('./db');

const retrieveDoctor = async (req, res) => {
  try {
    const db = await getConnection();
    const sql = 'SELECT * FROM doctor';
    const result = await db.query(sql);

    const rows = result[0];
    const columns = result[1];

    let tableHtml = '<table><tr>';
    for (let i = 0; i < columns.length; i++) {
      tableHtml += `<th>${columns[i].name}</th>`;
    }
    tableHtml += '<th>Patients Under</th></tr>';

    for (let i = 0; i < rows.length; i++) {
      tableHtml += '<tr>';
      tableHtml += '<td></td>';
      tableHtml += `<td>${rows[i].did}</td>`;
      tableHtml += `<td>${rows[i].name}</td>`;
      tableHtml += `<td>${rows[i].email}</td>`;
      tableHtml += `<td>${rows[i].phone}</td>`;
      tableHtml += `<td>${rows[i].age}</td>`;
      tableHtml += `<td>${rows[i].joindate}</td>`;
      tableHtml += `<td>${rows[i].salary}</td>`;
      tableHtml += `<td>${rows[i].specialist}</td>`;
      tableHtml += `<td>${rows[i].patients}</td>`;
      tableHtml += `<td><form method="GET" action="RetrievePatientsDID"><input hidden value ="${rows[i].did}" name="did"><input type="submit" value="Click"></form></td>`;
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    res.send(tableHtml);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error. Please try again later.');
  }
};

module.exports = retrieveDoctor;
