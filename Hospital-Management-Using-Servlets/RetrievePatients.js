fetch('/RetrievePatients')
  .then(response => response.json())
  .then(data => {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const columns = Object.keys(data[0]);
    
    columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    data.forEach(rowData => {
      const row = document.createElement('tr');
      
      columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = rowData[column];
        row.appendChild(td);
      });
      
      table.appendChild(row);
    });
    
    document.body.appendChild(table);
  })
  .catch(error => {
    console.error('Error:', error);
  });
