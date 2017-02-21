// Import regular server file
const server = require('./src/server');
// Import socket server file
const socketserver = require('./src/socketserver');
// Require socket.io
const io = require('socket.io');

const port = 4000;

// Start REST server
const liveserver = server.listen(port, () => {
  console.log(`Server live at http://localhost:${port}/`);
});

// Start Websocket server from liveserver
const livesocketserver = socketserver(io(liveserver));
