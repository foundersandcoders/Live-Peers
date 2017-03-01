// Import regular server file
const server = require('./src/server');
// Import socket server file
const socketserver = require('./src/socketrouter');
// Require socket.io
const io = require('socket.io');

const port = 8080;

// Start REST server
server.start(() => {
  console.log(`Server live at https://localhost:${port}/`);
});

// Start Websocket server from server listener (hapi implementation)
socketserver(io(server.listener));
