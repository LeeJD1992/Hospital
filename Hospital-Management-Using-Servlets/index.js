const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Check if the request is for the root path
  if (req.url === '/') {
    // Read the HTML file from disk
    const file = fs.readFileSync(path.join(__dirname, 'index.html'));
    // Set the Content-Type header and write the response
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(file);
    res.end();
  } else {
    // If the requested path is not the root, send a 404 error
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found');
    res.end();
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
