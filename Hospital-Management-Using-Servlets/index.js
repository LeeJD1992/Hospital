const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

// Serve the static files in the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests to the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other requests with a 404 error
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
