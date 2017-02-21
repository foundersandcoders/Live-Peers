const comms = require('./socketrouter');

module.exports = (io) => {
  // For all incoming, new, and disconnected sockets
  comms(io);
};
