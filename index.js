// To start the server
const server = require('./src/server.js');

server.start((err) => {
  if (err) { throw err; }
  console.log(`Server is running at ${server.info.uri}`);
});
